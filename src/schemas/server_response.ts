import { IBoardModel } from '@/game/models/board'

enum PrivateServerResponseStatus {
    ERROR = "ERROR",
    OK = "OK"
}

type MessageHeader = {
    room_uuid: string;
}

export type PrivateServerResponse = MessageHeader & {
    status: string;
    message: string | null;
    board?: IBoardModel;
}

export type PublicServerResponse = MessageHeader & {
    board: IBoardModel;
    player_turn_uuid: string;
}