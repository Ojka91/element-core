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

export type WaterReaction = {
    initial_river: Array<Position>;
    new_river: Array<Position>;
}

export type Reactions = {
    water: WaterReaction;
    fire: null;
    earth: null;
    wind: null;
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
    reaction: Reactions | null
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