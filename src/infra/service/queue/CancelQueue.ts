import { QueueController } from "../../socket/queue_controller";
import { Queue } from "../../socket/socketUtils";
import { InputSocket } from "../types/socketType";

export class CancelQueueService {
    constructor(
    private socket: InputSocket,
    private queueController: QueueController
    ) {}

    /**
   * User in queue cancels being in queue
   */
    public async execute(queue: Queue, userId: string) {
        this.socket.leave(queue);
        this.queueController.deleteUserFromArray(userId, queue);
    }
}
