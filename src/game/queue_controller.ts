import { Queue } from "@/utils/socketUtils";
type QueueData =  {
    number_players: number;
    max_players_allowed: 2;
    users: string[];
} | {
    number_players: number;
    max_players_allowed: 3;
    users: string[];
} | {
    number_players: number;
    max_players_allowed: 4;
    users: string[];
}

type QueueTypesController = {
    [Queue.queue2]: {number_players: number, max_players_allowed: 2, users: string[]} 
    [Queue.queue3]: {number_players: number, max_players_allowed: 3, users: string[]} 
    [Queue.queue4]: {number_players: number, max_players_allowed: 4, users: string[]} 
}
export class QueueController {

    private queueTypes: QueueTypesController = {
        [Queue.queue2]: {
            number_players: 0,
            max_players_allowed: 2,
            users: []
        },
        [Queue.queue3]: {
            number_players: 0,
            max_players_allowed: 3,
            users: []
        },
        [Queue.queue4]: {
            number_players: 0,
            max_players_allowed: 4,
            users: []
        }
    }

    public isQueueFull(queue: Queue): boolean {
        let isQueueFull = false;

        if (this.queueTypes[queue].number_players === this.queueTypes[queue].max_players_allowed) isQueueFull = true;

        return isQueueFull;
    }

    public addToQueue(queue: Queue, socketId: string): void {
        this.queueTypes[queue].number_players++;
        this.queueTypes[queue].users.push(socketId);
    }

    public resetQueue(queue: Queue): void {
        this.queueTypes[queue].number_players = 0;
        this.queueTypes[queue].users = []
    }

    public deleteUserFromArray(socketId: string, queue?: Queue): void {
        if (queue) {
            this.queueTypes[queue].users.splice(this.queueTypes[queue].users.indexOf(socketId), 1);
            this.queueTypes[queue].number_players--;
        } else {
            let index = this.queueTypes[Queue.queue2].users.indexOf(socketId);
            this.deleteItemByIndexFromQueue(index, Queue.queue2);

            index = this.queueTypes[Queue.queue3].users.indexOf(socketId);
            this.deleteItemByIndexFromQueue(index, Queue.queue3);

            index = this.queueTypes[Queue.queue4].users.indexOf(socketId);
            this.deleteItemByIndexFromQueue(index, Queue.queue4);

        }
    }

    public getQueueData(queue: Queue): QueueData {
        return this.queueTypes[queue];
    }

    public deleteItemByIndexFromQueue (index: number, queue: Queue): void {
        if (index != -1) {
            this.queueTypes[queue].users.splice(index, 1);
            this.queueTypes[queue].number_players--;
        }
    }
}

