import { JoinQueue } from "@/socket";

export class QueueController {
    private number_players_queue2: number = 0;
    private number_players_queue3: number = 0;
    private number_players_queue4: number = 0;

    public isQueueFull(data: JoinQueue): boolean {
        let isQueueFull = false;
        switch(data.queue) {
            case 'queue2': {
                this.number_players_queue2++;
                if(this.number_players_queue2 == 2) isQueueFull = true;       
            }
            case 'queue3': {
                this.number_players_queue3++;
                if(this.number_players_queue3 == 3) isQueueFull = true;       
            }
            case 'queue4': {
                this.number_players_queue4++;
                if(this.number_players_queue4 == 4) isQueueFull = true;
            }
        }
        return isQueueFull;
    }
}

