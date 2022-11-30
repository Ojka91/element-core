import {v4 as uuidv4} from 'uuid';
import { IPieceModel, PieceModel, PieceModelMap, PieceTypes } from "./pieces";

export interface ISageModel extends IPieceModel {
    uuid: string;
}

export class SageModel extends PieceModel {
    /** Sage piece class */
    uuid: string;

    constructor(){
        super();
        this.uuid = uuidv4();
        this.string_representation = "S"
        this.type = PieceTypes.Sage;
    }
}

export class SageModelMap extends PieceModelMap {
    public toDomain(raw: any): SageModel {
        const sage: SageModel = new SageModel();
        sage.uuid = raw.uuid;
        sage.position = raw.position;
        sage.string_representation = raw.string_representation;
        return sage;
    }
}