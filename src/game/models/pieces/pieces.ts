import { Position } from "../../utils/position_utils";
import { Mapper } from "../../utils/mapper";

export enum PieceTypes {
    None,
    Empty,
    Sage,
    Element
}

export interface IPieceModel {
    position: Position;
    string_representation: string;
    type: PieceTypes
}

export abstract class PieceModel implements IPieceModel {
    position: Position = {
        row: 0,
        column: 0
    };
    // debugging purposes
    string_representation: string = "";
    type: PieceTypes = PieceTypes.None;
}

export abstract class PieceModelMap extends Mapper{
}