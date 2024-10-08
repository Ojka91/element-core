import { ElementTypes } from "@/domain/game/models/elements/elements";
import { Position } from "@/domain/game/utils/position_utils";

enum Events {
    Piece = "Piece",
    EndTurn = "EndTurn"
}

enum Pieces {
    Sage = "Sage",
    Water = "Water",
    Fire = "Fire",
    Earth = "Earth",
    Wind = "Wind"
}

type River = Array<Position>

export abstract class Reaction {
}

export class WaterReaction extends Reaction {

    initial_river: River;;
    new_river: River;

    constructor(initial_river: River, new_river: River) {
        super();
        this.initial_river = initial_river;
        this.new_river = new_river;
    }
}

type Piece = {
    position: Position;
    type: Pieces;
}

type MessageHeader = {
    room_uuid: string;
    player_uuid: string;
}

type PlacePieceBody = {
    piece: Piece;
    reaction: Reaction
}

export type PlacePieceSchema = MessageHeader & {
    event_type: Events;
    body: PlacePieceBody | null;
}

export type StartOfTurnSchema = MessageHeader & {
    requested_pieces: Array<ElementTypes>;
}

export type EndOfTurnSchema = MessageHeader & {

}