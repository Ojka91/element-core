import { Server, Socket } from "socket.io";
import {
  ChatClientToServer,
  ChatServerToClient,
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
  UserAuthData,
} from "./socketUtils";
import { IRoomModel } from "@/domain/game/models/room";
import { QueueController } from "./queue_controller";
import {
  PrivateServerResponse,
  PrivateServerResponseStatus,
  PublicServerResponse,
} from "@/infra/schemas/server_response";
import { logger } from "@/utils/logger";
import { UserModel } from "@/domain/game/models/user";
import CreateRoomUseCase from "@/app/roomUseCases/CreateRoomUseCase";
import JoinGameUseCase from "@/app/roomUseCases/JoinGameUseCase";
import GameStartUseCase from "@/app/roomUseCases/GameStartUseCase";
import { GameServices } from "../service/GameServices";
import EndTurnUseCase from "@/app/gameUseCases/EndTurnUseCase";
import DrawElementsUseCase from "@/app/gameUseCases/DrawElementsUseCase";
import PlaceElementUseCase from "@/app/gameUseCases/PlaceElementUseCase";
import MoveSageUseCase from "@/app/gameUseCases/MoveSageUseCase";
import GetRoomUseCase from "@/app/roomUseCases/GetRoomUseCase";
import UpdateSocketIdUseCase from "@/app/roomUseCases/UpdateSocketIdUseCase";
import ForceLoserUseCase from "@/app/gameUseCases/ForceLoserUseCase";
import GetUserListUseCase from "@/app/roomUseCases/GetUserListUseCase";

type InputSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type SocketIo = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export class SocketService {
  private io: SocketIo;
  private socket: InputSocket;

  constructor(io: SocketIo, socket: InputSocket) {
    this.io = io;
    this.socket = socket;
  }

  public async connectionService() {
    this.socket.broadcast.emit("currentUsersConnected", {
      currentUsersCount: this.io.engine.clientsCount,
    });
    console.log("user connected: " + this.socket.id);

    // If client is sending on connection userUuid and roomId, he may be trying to reconnect to a game
    if (
      this.socket.handshake.auth.userUuid &&
      this.socket.handshake.auth.roomUuid
    ) {
      try {
        console.log(
          `User reconnecting - uuid: ${this.socket.handshake.auth.userUuid} | roomId ${this.socket.handshake.auth.roomUuid}`
        );
        // Get the game from redis
        const room: IRoomModel = await GetRoomUseCase.execute(
          this.socket.handshake.auth.roomUuid
        );
        // If game exist AND userUuid belongs to the game we join the user to the room and send him an update with info
        if (
          room &&
          room.user_list.filter(
            (user) => user.uuid === this.socket.handshake.auth.userUuid
          )
        ) {
          await UpdateSocketIdUseCase.execute(
            room,
            this.socket.handshake.auth.userUuid,
            this.socket.id
          );
          this.socket.join(this.socket.handshake.auth.roomUuid);
          this.socket.emit(
            "gameUpdate",
            GameServices.preparePublicResponse(room)
          );
          console.log("User reconnected to a game successfuly");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
   * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
   * 2. We should check if there are enough players on queue room to start a game
   * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
   */
  public async onQueueService(
    roomIdList: string[],
    queue: Queue,
    queueController: QueueController,
  ) {
    console.log(queue);

    // 1. Client join queue room
    this.socket.join(queue);

    // Add to the queue
    queueController.addToQueue(queue, this.socket.id);

    // 2. Checking if that queue have enough players
    if (queueController.isQueueFull(queue)) {
      // 2.1 Creating and saving new room
      const roomId = await CreateRoomUseCase.execute(queue);
      // Adding roomID to our array that controls rooms
      roomIdList.push(roomId);
      // 2.1 Sending roomId to client for them to join
      this.io.to(queue).emit("gameFound", { roomId: roomId });
      // 2.1 Cleaning queue room. Kick all clients on the room !! This system may fail if we have a lot of concurrency, we may change it in the future
      queueController.resetQueue(queue);
      this.io.socketsLeave(queue);
    }
  }

  /**
   * User in queue cancels being in queue
   */
  public async cancelQueue(queue: Queue, queueController: QueueController) {
    this.socket.leave(queue);
    queueController.deleteUserFromArray(this.socket.id, queue);
  }

  /**
   * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
   * 1. Client should join game/roomId socket and as user on the game room
   * 2. We check if all players have joined or we are still waiting for someone to join
   * 2.1 If so, we start the game
   */
  public async joinGame(data: JoinGame) {

    // 1. Join game/roomId socket
    this.socket.join(data.roomId);
    // 1. Join user into the game room
    const userAuthData: UserAuthData = await JoinGameUseCase.execute(
      data.roomId,
      {
        socketId: this.socket.id,
        username: data.username,
      }
    );
    console.log({ userAuthData });
    // We emit auth userData to joinedSocket
    this.socket.emit("userAuthData", userAuthData);

    // When room is full we startGame and send gameUpdate to the players
    const responseData = await GameStartUseCase.execute(data.roomId);
    if (responseData != null) {
      this.gameUpdate(data.roomId, responseData);
    }
  }

  /**
   * endTurn: Client which turn is playing should emit to this event with all the changes in the board
   */
  public async endTurn(data: EndTurn) {

    // A client may decide to force ending turn
    const response: PublicServerResponse = await EndTurnUseCase.execute(
      data.roomId
    );
    this.gameUpdate(data.roomId, response);
  }

  /**
   * drawElements: Client which turn is playing should draw elements
   */
  public async drawElements(data: DrawElements) {
    let response: PublicServerResponse | null = null;
    try {
      response = await DrawElementsUseCase.execute(
        data.roomId,
        data.numOfElements,
        this.socket.id
      );
    } catch (error) {
      // If there is any error we will notify only to the client who generate the error
      logger.warn(error);
      const response_error: PrivateServerResponse = GameServices.preparePrivateErrorResponse(
        data.roomId,
        error as Error,
      );
      this.socket.emit("error", response_error);
    }
    this.gameUpdate(data.roomId, response);
  }

  /**
   * placeElement: Client which turn is playing should place element
   */
  public async placeElement(data: PlaceElement) {

    let response: PublicServerResponse | null = null;
    try {
      response = await PlaceElementUseCase.execute(
        data.roomId,
        this.socket.id,
        data.element,
        data.position,
        data.reaction
      );
    } catch (error) {
      // If there is any error we will notify only to the client who generate the error
      logger.warn(error);
      let response: PrivateServerResponse = GameServices.preparePrivateErrorResponse(
        data.roomId,
        error as Error
      );
      this.socket.emit("error", response);
    }
    this.gameUpdate(data.roomId, response);
  }

  /**
   * moveSage: Client which turn is playing should move sage
   */

  public async moveSage(data: MoveSage) {

    let response: PublicServerResponse | null = null;
    try {
      // TODO TBD !!! We should check if game ended => delete roomId from array

      response = await MoveSageUseCase.execute(
        data.roomId,
        this.socket.id,
        data.position
      );
    } catch (error) {
      // If there is any error we will notify only to the client who generate the error
      logger.warn(error);
      let response: PrivateServerResponse = GameServices.preparePrivateErrorResponse(
        data.roomId,
        error as Error,
      );
      this.socket.emit("error", response);
    }
    this.gameUpdate(data.roomId, response);
  }

  /**
   * forfeit: A player surrender
   */
  public async forfeit(data: ForfeitData) {

    let response: PublicServerResponse | null = null;
    try {
      response = await ForceLoserUseCase.execute(data.roomId, this.socket.id);
    } catch (error) {
      // If there is any error we will notify only to the client who generate the error
      logger.warn(error);
      let response: PrivateServerResponse = {
        room_uuid: data.roomId,
        status: PrivateServerResponseStatus.ERROR,
        message: (error as Error).message,
      };
      this.socket.emit("error", response);
    }
    this.gameUpdate(data.roomId, response);
  }

  /**
   * When player disconnect we only have socket id.
   * We loop through roomId array and get userLists for every room
   * When a user match the socketId it's disconnected we force that player as a loser and emit response
   */
  public async disconnect(queueController: QueueController) {
    console.log("disconnecting " + this.socket.id);
    queueController.deleteUserFromArray(this.socket.id);
    this.socket.broadcast.emit("currentUsersConnected", {
      currentUsersCount: this.io.engine.clientsCount,
    });
  }

  /**
   * Chat event enables the possibility to have a chat with other players in your game.
   * The event receives the roomID and the message a player wants to send to the chat, and broadcast it
   * to all players within the room
   */
  public async chat(data: ChatClientToServer) {

    const userList: Array<UserModel> = await GetUserListUseCase.execute(
      data.roomId
    );
    const userModel: UserModel = userList.filter(
      (user) => user.socket_id == this.socket.id
    )[0];

    const response: ChatServerToClient = {
      user: userModel,
      message: data.message,
    };

    this.io.to(data.roomId).emit("chat", response);
  }

  public async forceGameUpdate(data: any) {
    /**
     * Testing porpouses
     * When client triggers this event, an event is sent to the room1 under boardMovement event
     */
    const room: IRoomModel = await GetRoomUseCase.execute(
      this.socket.handshake.auth.roomUuid
    );
    this.gameUpdate(room.uuid, GameServices.preparePublicResponse(room));
  }

  private async gameUpdate(roomId: string, data: PublicServerResponse | null) {
    this.io.to(roomId).emit("gameUpdate", data);
  }
  /********************************************************************/
  // From here below, testing only
  public async joinRoom(data: any) {
    /**
     * Testing porpouses
     * When client triggers this event, client will join data1
     */
    this.socket.join("room1");
    console.log(data);
  }

  public async triggerFromClient(data: any) {
    /**
     * Testing porpouses
     * When client triggers this event, an event is sent to the room1 under boardMovement event
     */
    this.io.to("room1").emit("boardMovement", { board: "new" });
    console.log(data);
  }
}
