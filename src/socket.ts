import { Server, Socket } from "socket.io";
import { GameService } from "./game/game_service";
import { RoomModel } from "./game/models/room";
import { QueueController } from "./game/queue_controller";
import { PrivateServerResponse, PublicServerResponse } from "./schemas/server_response";
import { ElementTypes } from "./game/models/elements/elements";
import { Position } from "./game/utils/position_utils";
import { Reaction } from "./schemas/player_actions";
import { IPlayerModel } from "./game/models/player";
import { logger } from "./utils/logger";

interface ServerToClientEvents {
  error: (response: PrivateServerResponse) => void;
  gameUpdate: (response: PublicServerResponse) => void;
}

interface ClientToServerEvents {
  onQueue: (queue: Queue) => void;
  joinGame: (data: JoinGame) => void;
  endTurn: (data: EndTurn) => void;
  drawElements: (data: DrawElements) => void;
  placeElement: (data: PlaceElement) => void;
  moveSage: (data: MoveSage) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {

}

export enum Queue {
  queue2 = 'queue2',
  queue3 = 'queue3',
  queue4 = 'queue4'
}

export type JoinGame = {
  roomId: string
}
export type EndTurn = {
  roomId: string,
  room: RoomModel
}
export type DrawElements = {
  roomId: string
  elements: Array<ElementTypes>
}
export type PlaceElement = {
  roomId: string
  element: ElementTypes
  position: Position
  reaction?: Reaction
}
export type MoveSage = {
  roomId: string
  player: IPlayerModel
  position: Position
}

/**
 * This class is reponsible to mantain socket connection and logic between players and server when game begins
 */
class SocketController {
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

    this.io.on("connection", (socket: Socket<ClientToServerEvents,
      ServerToClientEvents>) => {

      console.log("user connected")

      /**
       * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
       * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
       * 2. We should check if there are enough players on queue room to start a game
       * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
       */
      socket.on("onQueue", async (data: Queue) => {
        console.log(data)

        // 1. Client join queue room
        socket.join(data)

        // Add to the queue
        queueController.addToQueue(data);

        // 2. Checking if that queue have enough players
        if (queueController.isQueueFull(data)) {
          // 2.1 Creating and saving new room
          const roomId = await gameService.createRoom(data);

          // 2.1 Sending roomId to client for them to join
          this.io.to(data).emit('gameFound', { roomId: roomId });
          // 2.1 Cleaning queue room. Kick all clients on the room !! This system may fail if we have a lot of concurrency, we may change it in the future
          this.io.socketsLeave(data);
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
        // 1. Join user into the game room and starts the game WHEN all users have joined
        const response: PublicServerResponse | null = await gameService.joinGame(data.roomId, socket.id);

        if (response) this.io.to(data.roomId).emit('gameUpdate', response);

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
        console.log(data.elements)

        let response: PublicServerResponse | null = null;
        try {
          
          response = await gameService.drawElements(data.roomId, data.elements, socket.id);
        } catch (error) {
          // If there is any error we will notify only to the client who generate the error
          logger.warn(error)
          let response: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: 'Error',
            message: JSON.stringify(error),
          }
          socket.emit('error', response)
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
          logger.warn(error)
          let response: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: 'Error',
            message: JSON.stringify(error),
          }
          socket.emit('error', response)
        }
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      /**
       * moveSage: Client which turn is playing should move sage
       */
      socket.on("moveSage", async (data: MoveSage) => {
        console.log(data.player)

        let response: PublicServerResponse | null = null;
        try {
          
          response = await gameService.moveSage(data.roomId, socket.id, data.player, data.position);
          
        } catch (error) {
          // If there is any error we will notify only to the client who generate the error
          logger.warn(error)
          let response: PrivateServerResponse = {
            room_uuid: data.roomId,
            status: 'Error',
            message: JSON.stringify(error),
          }
          socket.emit('error', response)
        }
        this.io.to(data.roomId).emit('gameUpdate', response)

      })

      socket.on("disconnect", (socket: any) => {
        console.log("client disconnected")

      })

    })

  }

}

export default SocketController;

