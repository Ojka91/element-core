import { EmptyModel } from "@/domain/game/models/pieces/empty";
import { PieceController } from "./piece_controller";

export interface IEmptyController {
}

export class EmptyController extends PieceController implements IEmptyController {
    /** Empty piece class */
    constructor(model: EmptyModel){
        super(model);
    }
}