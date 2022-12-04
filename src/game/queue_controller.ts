import { Queue } from "@/utils/socketUtils";

type QueueTypesController = {
    [Queue.queue2]: {number_players: number, max_players_allowed: 2} 
    [Queue.queue3]: {number_players: number, max_players_allowed: 3} 
    [Queue.queue4]: {number_players: number, max_players_allowed: 4} 
}
export class QueueController {

    private queueTypes: QueueTypesController = {
        [Queue.queue2]: {
            number_players: 0,
            max_players_allowed: 2
        },
        [Queue.queue3]: {
            number_players: 0,
            max_players_allowed: 3

        },
        [Queue.queue4]: {
            number_players: 0,
            max_players_allowed: 4
        }
    }

    public isQueueFull(queue: Queue): boolean {
        let isQueueFull = false;

        if (this.queueTypes[queue].number_players === this.queueTypes[queue].max_players_allowed) isQueueFull = true;

        return isQueueFull;
    }

    public addToQueue(queue: Queue): void {
        this.queueTypes[queue].number_players++;
    }

    public resetQueue(queue: Queue): void {
        this.queueTypes[queue].number_players = 0;
    }
}

