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

enum Elements {
    Sage = "Sage",
    Water = "Water",
    Fire = "Fire",
    Earth = "Earth",
    Wind = "Wind"
}

type Position = {
    row: number;
    column: number;
}

type River = Array<Position>

export abstract class Reaction {
}

export class WaterReaction extends Reaction {
    
    initial_river: River;;
    new_river: River;

    constructor(initial_river: River, new_river: River){
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
    reaction: Reactions
}

export type PlacePieceSchema = MessageHeader & {
    event_type: Events;
    body: PlacePieceBody | null;
}

export type StartOfTurnSchema = MessageHeader & {
    requested_pieces: Array<Elements>;
}

export type EndOfTurnSchema = MessageHeader & {
    
}