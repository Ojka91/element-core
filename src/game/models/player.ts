import { Sage } from "./pieces";


class Player {
    private uuid: string;
    private player_number: number;
    private sage?: Sage;

    constructor(player_number: number){
        
        this.player_number = player_number;
        this.uuid = "Player "+player_number;
    }

    public setSage(sage: Sage): void {
        this.sage = sage;
    }

    public getSage(): Sage{
        if(this.sage === undefined){
            throw new Error("Player has no assigned sage")
        }
        return this.sage;
    }

    public getUuid(): string{
        return this.uuid;
    }

    public getPlayerNumber(): number {
        return this.player_number;
    }
}

export default Player;