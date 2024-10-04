import { Server, Socket } from "socket.io";
import { GameService } from "../service/game_service";
import { QueueController } from "../socket/queue_controller";
import { ChatClientToServer, ClientToServerEvents, DrawElements, EndTurn, ForfeitData, InterServerEvents, JoinGame, MoveSage, PlaceElement, Queue, ServerToClientEvents, SocketData } from "./socketUtils";
import { cancelQueue, chat, connectionService, disconnect, drawElements, endTurn, forceGameUpdate, forfeit, joinGame, joinRoom, moveSage, onQueueService, placeElement, triggerFromClient } from "./socketServices";

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

      connectionService(socket, gameService);

      /**
       * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
       * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
       * 2. We should check if there are enough players on queue room to start a game
       * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
       */
      socket.on("onQueue", async (queue: Queue) => {
        onQueueService(this.io, socket, this.roomsIds, queue, queueController, gameService);

      })

      /**
       * User in queue cancels being in queue
       */
      socket.on("cancelQueue", async (data: Queue) => {
        cancelQueue(socket, data, queueController);
      })

      /**
       * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
       * 1. Client should join game/roomId socket and as user on the game room
       * 2. We check if all players have joined or we are still waiting for someone to join
       * 2.1 If so, we start the game
       */
      socket.on("joinGame", async (data: JoinGame) => {
        joinGame(this.io, socket, data, gameService);
      })

      /**
       * endTurn: Client which turn is playing should emit to this event with all the changes in the board
       */
      socket.on("endTurn", async (data: EndTurn) => {
        endTurn(this.io, data, gameService);
      })

      /**
       * drawElements: Client which turn is playing should draw elements
       */
      socket.on("drawElements", async (data: DrawElements) => {
        drawElements(this.io, socket, data, gameService);

      })

      /**
       * placeElement: Client which turn is playing should place element
       */
      socket.on("placeElement", async (data: PlaceElement) => {
        placeElement(this.io, socket, gameService, data);

      })

      /**
       * moveSage: Client which turn is playing should move sage
       */
      socket.on("moveSage", async (data: MoveSage) => {
        moveSage(this.io, socket, gameService, data);
      })

      /**
       * forfeit: A player surrender
       */
      socket.on("forfeit", async (data: ForfeitData) => {
        forfeit(this.io, socket, gameService, data);
      })

      /**
       * When player disconnect we only have socket id.
       * We loop through roomId array and get userLists for every room
       * When a user match the socketId it's disconnected we force that player as a loser and emit response
       */
      socket.on("disconnect", async () => {
        disconnect(socket, queueController);
      })

      /**
       * Chat event enables the possibility to have a chat with other players in your game.
       * The event receives the roomID and the message a player wants to send to the chat, and broadcast it
       * to all players within the room
       */
      socket.on("chat", async (data: ChatClientToServer) => {
        chat(this.io, socket, gameService, data);
      })

      socket.on("forceGameUpdate", async (data: any) => {
        forceGameUpdate(this.io, socket, gameService, data);
      })

      // From here below, testing only
      socket.on("joinRoom", (data: any) => {
        joinRoom(socket, data);
      })

      socket.on("triggerFromClient", (data: any) => {
        triggerFromClient(this.io, data);
      })
    })

  }

}

export default SocketController;

