import CreateRoom from "@/app/use-cases/room/CreateRoom";
import { QueueController } from "../../socket/queue_controller";
import { Queue } from "../../socket/socketUtils";
import { InputSocket, SocketIo } from "../types/socketType";

export class OnQueueService {
    constructor(
    private io: SocketIo,
    private socket: InputSocket,
    private queueController: QueueController
    ) {}

    /**
   * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
   * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
   * 2. We should check if there are enough players on queue room to start a game
   * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
   */
    public async execute(roomIdList: string[], queue: Queue) {
        console.log(queue);

        // 1. Client join queue room
        this.socket.join(queue);

        // Add to the queue
        this.queueController.addToQueue(queue, this.socket.id);

        // 2. Checking if that queue have enough players
        if (this.queueController.isQueueFull(queue)) {
            // 2.1 Creating and saving new room
            const roomId = await CreateRoom.execute(queue);
            // Adding roomID to our array that controls rooms
            roomIdList.push(roomId);
            // 2.1 Sending roomId to client for them to join
            this.io.to(queue).emit("gameFound", { roomId: roomId });
            // 2.1 Cleaning queue room. Kick all clients on the room !! This system may fail if we have a lot of concurrency, we may change it in the future
            this.queueController.resetQueue(queue);
            this.io.socketsLeave(queue);
        }
    }
}
