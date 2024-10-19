import { QueueController } from "../../socket/queue_controller";
import { InputSocket, SocketIo } from "../types/socketType";

export class SocketDisconnectService {
    constructor(
    private io: SocketIo,
    private socket: InputSocket,
    private queueController: QueueController
    ) {}

    /**
   * When player disconnect we only have socket id.
   * We loop through roomId array and get userLists for every room
   */
    public async execute() {
        console.log("disconnecting " + this.socket.id);
        this.queueController.deleteUserFromArray(this.socket.id);
        this.socket.broadcast.emit("currentUsersConnected", {
            currentUsersCount: this.io.engine.clientsCount,
        });
    }
}
