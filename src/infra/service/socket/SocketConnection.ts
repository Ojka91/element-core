import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,

} from "../../socket/socketUtils";
import { IRoomModel } from "@/domain/game/models/room";
import GetRoom from "@/app/use-cases/room/GetRoom";
import UpdateSocketId from "@/app/use-cases/room/UpdateSocketId";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { GameServices } from "@/domain/service/GameServices";


type InputSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type SocketIo = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export class SocketConnectionService {
  constructor(
    private io: SocketIo,
    private socket: InputSocket
  ) {
  }

  public async execute(): Promise<PublicServerResponse | null> {
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
        const room: IRoomModel = await GetRoom.execute(
          this.socket.handshake.auth.roomUuid
        );
        // If game exist AND userUuid belongs to the game we join the user to the room and send him an update with info
        if (
          room &&
          room.user_list.filter(
            (user) => user.uuid === this.socket.handshake.auth.userUuid
          )
        ) {
          await UpdateSocketId.execute(
            room,
            this.socket.handshake.auth.userUuid,
            this.socket.id
          );

          this.socket.join(this.socket.handshake.auth.roomUuid);
          console.log("User reconnected to a game successfuly");
          return GameServices.preparePublicResponse(room);
        }
      } catch (error) {
        console.log(error);
      }
    }
    return null;
  }
}