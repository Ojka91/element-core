import { IGameModel } from '@/game/models/game';
import { IRoomModel } from '@/game/models/room';

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
    game?: IRoomModel;
}

export type PublicServerResponse = MessageHeader & {
    room: IRoomModel;
    player_turn_uuid: string;
    winner?: string | null;
}