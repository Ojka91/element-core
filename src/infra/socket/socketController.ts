import { Server, Socket } from "socket.io";
import { QueueController } from "./queue_controller";
import {
  ChatClientToServer,
  ClientToServerEvents,
  DrawElements,
  EndTurn,
  ForfeitData,
  InterServerEvents,
  JoinGame,
  MoveSage,
  PlaceElement,
  Queue,
  ServerToClientEvents,
  SocketData,
} from "./socketUtils";
import { SocketService } from "./socketServices";

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
    >(server);
  }
  public init() {
    const queueController = new QueueController();

    this.io.on(
      "connection",
      async (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
        const socketService = new SocketService(this.io, socket);

        socketService.connectionService();

        /**
         * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
         * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
         * 2. We should check if there are enough players on queue room to start a game
         * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
         */
        socket.on("onQueue", async (queue: Queue) => {
          socketService.onQueueService(
            this.roomsIds,
            queue,
            queueController,
          );
        });

        /**
         * User in queue cancels being in queue
         */
        socket.on("cancelQueue", async (data: Queue) => {
          socketService.cancelQueue(data, queueController);
        });

        /**
         * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
         * 1. Client should join game/roomId socket and as user on the game room
         * 2. We check if all players have joined or we are still waiting for someone to join
         * 2.1 If so, we start the game
         */
        socket.on("joinGame", async (data: JoinGame) => {
          socketService.joinGame(data);
        });

        /**
         * endTurn: Client which turn is playing should emit to this event with all the changes in the board
         */
        socket.on("endTurn", async (data: EndTurn) => {
          socketService.endTurn(data);
        });

        /**
         * drawElements: Client which turn is playing should draw elements
         */
        socket.on("drawElements", async (data: DrawElements) => {
          socketService.drawElements(data);
        });

        /**
         * placeElement: Client which turn is playing should place element
         */
        socket.on("placeElement", async (data: PlaceElement) => {
          socketService.placeElement(data);
        });

        /**
         * moveSage: Client which turn is playing should move sage
         */
        socket.on("moveSage", async (data: MoveSage) => {
          socketService.moveSage(data);
        });

        /**
         * forfeit: A player surrender
         */
        socket.on("forfeit", async (data: ForfeitData) => {
          socketService.forfeit(data);
        });

        /**
         * When player disconnect we only have socket id.
         * We loop through roomId array and get userLists for every room
         * When a user match the socketId it's disconnected we force that player as a loser and emit response
         */
        socket.on("disconnect", async () => {
          socketService.disconnect(queueController);
        });

        /**
         * Chat event enables the possibility to have a chat with other players in your game.
         * The event receives the roomID and the message a player wants to send to the chat, and broadcast it
         * to all players within the room
         */
        socket.on("chat", async (data: ChatClientToServer) => {
          socketService.chat(data);
        });

        socket.on("forceGameUpdate", async (data: any) => {
          socketService.forceGameUpdate(data);
        });

        // From here below, testing only
        socket.on("joinRoom", (data: any) => {
          socketService.joinRoom(data);
        });

        socket.on("triggerFromClient", (data: any) => {
          socketService.triggerFromClient(data);
        });
      }
    );
  }
}

export default SocketController;
