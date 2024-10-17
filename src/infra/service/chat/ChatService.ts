import GetUserList from "@/app/use-cases/room/GetUserList";
import { UserModel } from "@/domain/game/models/user";
import {
  ChatClientToServer,
  ChatServerToClient,
} from "../../socket/socketUtils";
import { InputSocket, SocketIo } from "../types/socketType";

export class ChatService {
  constructor(private io: SocketIo, private socket: InputSocket) {}

  /**
   * Chat event enables the possibility to have a chat with other players in your game.
   * The event receives the roomID and the message a player wants to send to the chat, and broadcast it
   * to all players within the room
   */
  public async execute(data: ChatClientToServer) {
    const userList: Array<UserModel> = await GetUserList.execute(data.roomId);
    const userModel: UserModel = userList.filter(
      (user) => user.socket_id == this.socket.id
    )[0];

    const response: ChatServerToClient = {
      user: userModel,
      message: data.message,
    };

    this.io.to(data.roomId).emit("chat", response);
  }
}
