import Board from '@/game/models/board'

enum PrivateServerResponseStatus {
    ERROR = "ERROR",
    OK = "OK"
}

type MessageHeader = {
    room_uuid: string;
}

export type PrivateServerResponse = MessageHeader & {
    status: PrivateServerResponse;
    message: string | null;
    board: Board;
}

export type PublicServerResponse = MessageHeader & {
    board: Board;
    player_turn_uuid: string;
}