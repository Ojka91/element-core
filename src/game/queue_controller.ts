import { Queue } from "@/utils/socketUtils";

export class QueueController {
    private number_players_queue2: number = 0;
    private number_players_queue3: number = 0;
    private number_players_queue4: number = 0;

    public isQueueFull(data: Queue): boolean {
        let isQueueFull = false;
        switch(data) {
            case 'queue2': {
                if(this.number_players_queue2 == 2) {
                    isQueueFull = true
                    this.number_players_queue2 = 0;
                }
                break;       
            }
            case 'queue3': {
                if(this.number_players_queue3 == 3) {
                    isQueueFull = true;  
                    this.number_players_queue3 = 0;
                }
                break;     
            }
            case 'queue4': {
                if(this.number_players_queue4 == 4){
                    isQueueFull = true;
                    this.number_players_queue4 = 0;
                } 
                break;
            }
        }
        return isQueueFull;
    }

    public addToQueue(data: Queue): void {
        switch(data) {
            case 'queue2': {
                this.number_players_queue2++;
                break;
            }
            case 'queue3': {
                this.number_players_queue3++;
                break;
            }
            case 'queue4': {
                this.number_players_queue4++;
                break;
            }
        }
    }
}

