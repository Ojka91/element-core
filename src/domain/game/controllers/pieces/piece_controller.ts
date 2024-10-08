import { Position } from "@/domain/game/utils/position_utils";
import { IPieceModel } from "@/domain/game/models/pieces/pieces";

export interface IPieceController {
    updatePosition(new_position: Position): void
}

export abstract class PieceController implements IPieceController {

    protected model: IPieceModel;

    constructor(model: IPieceModel){
        this.model = model
    }

    public updatePosition(new_position: Position): void {
        this.model.position = new_position;
    }
}



