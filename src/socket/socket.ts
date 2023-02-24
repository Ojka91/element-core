import { Server, Socket } from "socket.io";
import RoomController from "../game/controllers/room_controller";
import { GameService } from "../service/game_service";
import { IRoomModel, RoomModel } from "../game/models/room";
import { QueueController } from "../socket/queue_controller";
import { PrivateServerResponse, PrivateServerResponseStatus, PublicServerResponse } from "../schemas/server_response";
import { logger } from "../utils/logger";
import { ChatClientToServer, ChatServerToClient, ClientToServerEvents, DrawElements, EndTurn, ForfeitData, InterServerEvents, JoinGame, MoveSage, PlaceElement, Queue, ServerToClientEvents, SocketData, UserAuthData } from "./socketUtils";
import GameCache from "@/service/game_cache";
import { UserModel } from "@/game/models/user";

/**
 * This class is reponsible to mantain socket connection and logic between players and server when game begins
 */
class SocketController {
  private io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

  private roomsIds: string[] = [];

  constructor(server: any) {
    this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server)
  }
  public init() {

    const queueController = new QueueController();
    const gameService = new GameService()

    this.io.on("connection", async (socket: Socket<ClientToServerEvents,
      ServerToClientEvents>) => {

      console.log("user connected: " + socket.id)
      console.log(socket.handshake.auth)
      // If client is sending on connection userUuid and roomId, he may be trying to reconnect to a game
      if (socket.handshake.auth.userUuid && socket.handshake.auth.roomUuid) {
        try { 

          console.log(`User reconnecting - uuid: ${socket.handshake.auth.userUuid} | roomId ${socket.handshake.auth.roomUuid}`)
          // Get the game from redis
          const room: IRoomModel = await gameService.getRoom(socket.handshake.auth.roomUuid)
          // If game exist AND userUuid belongs to the game we join the user to the room and send him an update with info
          if (room && room.user_list.filter(user => user.uuid === socket.handshake.auth.userUuid)) {
            await gameService.updateSocketId(room, socket.handshake.auth.userUuid, socket.id)
            socket.join(socket.handshake.auth.roomUuid)
            socket.emit('gameUpdate', gameService.preparePublicResponse(room))
            console.log('User reconnected to a game successfuly')
          }
        } catch (error) {
          console.log(error)
        }
      }

      /**
       * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
       * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
       * 2. We should check if there are enough players on queue room to start a game
       * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
       */
      socket.on("onQueue", async (queue: Queue) => {
        console.log(queue)

        // 1. Client join queue room
        socket.join(queue)

        // Add to the queue
        queueController.addToQueue(queue, socket.id);

        // 2. Checking if that queue have enough players
        if (queueController.isQueueFull(queue)) {
          // 2.1 Creating and saving new room
          const roomId = await gameService.createRoom(queue);
          // Adding roomID to our array that controls rooms
          this.roomsIds.push(roomId);
          // 2.1 Sending roomId to client for them to join
          this.io.to(queue).emit('gameFound', { roomId: roomId });
          // 2.1 Cleaning queue room. Kick all clients on the room !! This system may fail if we have a lot of concurrency, we may change it in the future
          queueController.resetQueue(queue);
          this.io.socketsLeave(queue);
        }

      })

      /**
       * User in queue cancels being in queue
       */
      socket.on("cancelQueue", async (data: Queue) => {
        console.log(data)
        socket.leave(data);
        queueController.deleteUserFromArray(socket.id, data);

      })

      /**
       * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
       * 1. Client should join game/roomId socket and as user on the game room
       * 2. We check if all players have joined or we are still waiting for someone to join
       * 2.1 If so, we start the game
       */
      socket.on("joinGame", async (data: JoinGame) => {
        console.log(data.roomId)

        // 1. Join game/roomId socket
        socket.join(data.roomId)
        // 1. Join user into the game room
        const userAuthData: UserAuthData = await gameService.joinGame(data.roomId, {
          socketId: socket.id,
          username: data.username
        });
        console.log({userAuthData})
        // We emit auth userData to joinedSocket
        socket.emit('userAuthData', userAuthData);
       
        // When room is full we startGame and send gameUpdate to the players
        if (await gameService.isRoomFull(data.roomId)) {
          const roomModel = await gameService.gameStart(data.roomId);
          this.io.to(data.roomId).emit('gameUpdate', gameService.preparePublicResponse(roomModel));
        }

      })

      /**
       * endTurn: Client which turn is playing should emit to this event with all the changes in the board
       */
      socket.on("endTurn", async (data: EndTurn) => {
        console.log(data.roomId)

        // A client may decide to force ending turn
        const response: PublicServerResponse = await gameService.endTurn(data.roomId)
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      /**
       * drawElements: Client which turn is playing should draw elements
       */
      socket.on("drawElements", async (data: DrawElements) => {
        console.log(data)

        let response: PublicServerResponse | null = null;
        try {
          
          response = await gameService.drawElements(data.roomId, data.numOfElements, socket.id);
        } catch (error) {
          // If there is any error we will notify only to the client who generate the error
          logger.warn(error)
          const response_error: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: PrivateServerResponseStatus.ERROR,
            message: (error as Error).message,
          }
          socket.emit('error', response_error)
        }
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      /**
       * placeElement: Client which turn is playing should place element
       */
      socket.on("placeElement", async (data: PlaceElement) => {
        console.log(data.element)

        let response: PublicServerResponse | null = null;
        try {
          
          response = await gameService.placeElement(data.roomId, socket.id, data.element, data.position, data.reaction);
        } catch (error) {
          // If there is any error we will notify only to the client who generate the error
          logger.warn(error);
          let response: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: PrivateServerResponseStatus.ERROR,
            message: (error as Error).message,
          }
          socket.emit('error', response)
        }
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      /**
       * moveSage: Client which turn is playing should move sage
       */
      socket.on("moveSage", async (data: MoveSage) => {
        console.log(data.playerId)

        let response: PublicServerResponse | null = null;
        try {
          
          // TODO TBD !!! We should check if game ended => delete roomId from array
          
          response = await gameService.moveSage(data.roomId, socket.id, data.playerId, data.position);
          
        } catch (error) {
          // If there is any error we will notify only to the client who generate the error
          logger.warn(error)
          let response: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: PrivateServerResponseStatus.ERROR,
            message: (error as Error).message,
          }
          socket.emit('error', response)
        }
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      /**
       * forfeit: A player surrender
       */
      socket.on("forfeit", async (data: ForfeitData) => {
        console.log(`forfeit ${data} `)

        let response: PublicServerResponse | null = null;
        try {
          
          response = await gameService.forceLoser(data.roomId, socket.id);
                    
        } catch (error) {
          // If there is any error we will notify only to the client who generate the error
          logger.warn(error)
          let response: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: PrivateServerResponseStatus.ERROR,
            message: (error as Error).message,
          }
          socket.emit('error', response)
        }
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      /**
       * When player disconnect we only have socket id.
       * We loop through roomId array and get userLists for every room
       * When a user match the socketId it's disconnected we force that player as a loser and emit response
       */
      socket.on("disconnect", async () => {
        console.log('disconnecting ' + socket.id)
        queueController.deleteUserFromArray(socket.id);
        let [response, roomId]: [PublicServerResponse, string] = await gameService.playerDisconnect(this.roomsIds, socket.id);
        
        // Deleting the roomId of the ended game
        this.roomsIds.filter(id => {
          return id != roomId
        })
        this.io.to(roomId).emit('gameUpdate', response)
        
      })

      /**
       * Chat event enables the possibility to have a chat with other players in your game.
       * The event receives the roomID and the message a player wants to send to the chat, and broadcast it
       * to all players within the room
       */
      socket.on("chat", async (data: ChatClientToServer) => {
        console.log(`Chat | RoomId: ${data.roomId}, message: ${data.message}`);
        
        const userList: Array<UserModel> = await gameService.getUserList(data.roomId);
        const userModel: UserModel = userList.filter(user => user.socket_id == socket.id)[0];
        
        const response: ChatServerToClient = {
          user: userModel,
          message: data.message
        };

        this.io.to(data.roomId).emit('chat', response);
      })




      // From here below, testing only
      socket.on("joinRoom", (data: any) => {
        /**
         * Testing porpouses
         * When client triggers this event, client will join data1
         */
        socket.join('room1')
        console.log(data)
      })

      socket.on("triggerFromClient", (data: any) => {
        /**
         * Testing porpouses
         * When client triggers this event, an event is sent to the room1 under boardMovement event
         */
        this.io.to("room1").emit('boardMovement', { board: 'new' });
        console.log(data)
      })

      socket.on("forceGameUpdate", async (data: any) => {
        /**
         * Testing porpouses
         * When client triggers this event, an event is sent to the room1 under boardMovement event
         */
        const room: RoomModel = new RoomModel(0);
        const room_controller: RoomController = new RoomController(room, GameCache);
        await room_controller.loadRoomById(data.roomId);

        this.io.to("room1").emit('testUpdate', { room: room });
      })

    })

  }

}

export default SocketController;

