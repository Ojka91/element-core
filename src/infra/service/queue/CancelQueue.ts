import { Socket } from "socket.io";
import { QueueController } from "../../socket/queue_controller";
import {
  ClientToServerEvents,
  Queue,
  ServerToClientEvents
} from "../../socket/socketUtils";

type InputSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export class CancelQueueService {
  constructor(
    private socket: InputSocket,
    private queueController: QueueController
  ) {
  }

  /**
   * User in queue cancels being in queue
   */
  public async execute(queue: Queue, userId: string) {
    this.socket.leave(queue);
    this.queueController.deleteUserFromArray(userId, queue);
  }
}
