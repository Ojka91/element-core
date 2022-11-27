import { IPieceModel, PieceModel, PieceModelMap, PieceTypes } from "./pieces";

export interface IEmptyModel extends IPieceModel {

}

export class EmptyModel extends PieceModel implements IEmptyModel {
    /** Empty piece class */
    constructor(){
        super();
        this.string_representation = "."
        this.type = PieceTypes.Empty;
    }
}

export class EmptyModelMap extends PieceModelMap{
    public toDomain(raw: any): EmptyModel {
        const empty: EmptyModel = new EmptyModel();
        empty.position = raw.position;
        empty.string_representation = raw.string_representation;
        return empty;
    }
}