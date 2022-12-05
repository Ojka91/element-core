import { IGameModel } from '@/game/models/game';

export enum PrivateServerResponseStatus {
    ERROR = "ERROR",
    OK = "OK"
}

type MessageHeader = {
    room_uuid: string;
}

export type PrivateServerResponse = MessageHeader & {
    status: PrivateServerResponseStatus;
    message: string | null;
    game?: IGameModel;
}

export type PublicServerResponse = MessageHeader & {
    game: IGameModel;
    winner?: number | null;
    player_turn_uuid: string;
}