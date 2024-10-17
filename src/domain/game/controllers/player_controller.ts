import { ISageModel } from "@/domain/game/models/pieces/sage";
import { IPlayerModel, PlayerModel } from "../models/player";


class PlayerController {
    
    private model: PlayerModel;

    constructor(model: IPlayerModel){
        
        this.model = model;
    }

    public setSage(sage: ISageModel): void {
        this.model.sage = sage;
    }

    public getSage(): ISageModel{
        if(this.model.sage === undefined){
            throw new Error("Player has no assigned sage")
        }
        return this.model.sage;
    }

    public getUuid(): string{
        return this.model.uuid;
    }

    public getPlayerNumber(): number {
        return this.model.player_number;
    }

    public getConsecutiveSkippedTurns(): number {
        return this.model.consecutiveSkippedTurns;
    }

    public increaseConsecutiveSkippedTurns(): number {
        return ++this.model.consecutiveSkippedTurns;
    }

    public resetConsecutiveSkippedTurns(){
        this.model.consecutiveSkippedTurns = 0;
    }
}

export default PlayerController;