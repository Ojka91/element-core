import { Server } from "socket.io";
import RoomController from "./game/controllers/room_controller";
import { GameService } from "./game/game_service";
import { RoomModel } from "./game/models/room";
import { QueueController } from "./game/queue_controller";
import { PublicServerResponse } from "./schemas/server_response";
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export enum queue {
  queue2 = 'queue2',
  queue3 = 'queue3',
  queue4 = 'queue4'
}

export type JoinQueue = {
  queue: queue
}
export type JoinGame = {
  roomId: string
}
export type EndTurn = {
  roomId: string,
  room: RoomModel
}

/**
 * This class is reponsible to mantain socket connection and logic between players and server when game begins
 */
class Socket {
  private io: any;

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

    this.io.on("connection", (socket: any) => {

      console.log("user connected")

      /**
       * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
       * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
       * 2. We should check if there are enough players on queue room to start a game
       * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
       */
      socket.on("onQueue", async (data: JoinQueue) => {
        console.log(data.queue)

        // 1. Client join queue room
        socket.join(data.queue)

        // 2. Checking if that queue have enough players
        if (queueController.isQueueFull(data)) {
          // 2.1 Creating and saving new room
          const roomId = await gameService.createRoom(data);

          // 2.1 Sending roomId to client for them to join
          this.io.to(data.queue).emit('gameFound', { roomId: roomId });
          // 2.1 Cleaning queue room from those players that found the game !! This system may fail if we have a lot of concurrency, we may change it in the future
          this.io.socketsLeave(data.queue);
        }

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
        const roomController: RoomController = await gameService.joinGame(data.roomId, socket.id);


        // 2. Checking if room is full so game can start
        if (roomController.isRoomFull()) {
          // 2.1 Starting game
          await roomController.gameStart();
          const response: PublicServerResponse = gameService.preparePublicResponse(roomController);

          // 2.1 We emit a game update for the clients to start playing
          this.io.to(data.roomId).emit('gameUpdate', response); //My proposal is to use the event "gameUpdate" each time a player does something. So client...
          //... will have to listen to 'gameUpdate' and react accordingly
        }

      })

      /**
       * endTurn: Client which turn is playing should emit to this event with all the changes in the board
       */
      socket.on("endTurn", async (data: EndTurn) => {
        console.log(data.roomId)

        const response: PublicServerResponse = await gameService.endTurn(data.roomId)
        this.io.to(data.roomId).emit('gameUpdate', response)

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
        const room_controller: RoomController = new RoomController(room);
        await room_controller.loadRoomById(data.roomId);

        this.io.to("room1").emit('gameUpdate', { room: room });
      })

      socket.on("disconnect", (socket: any) => {
        console.log("client disconnected")

      })

    })

  }


  public emmitRoom() {
    this.io.to("room1").emit('something', { some: 'data' });
  }
}

export default Socket;

