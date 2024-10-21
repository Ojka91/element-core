import { UserModel, UserModelMap } from "./user";
import { GameModel, GameModelMap } from "./game";
import { Mapper } from "@/domain/game/utils/mapper";

import { v4 as uuidv4 } from 'uuid';

export type UserToPlayerMap = {
    user_uuid: string;
    player_uuid: string;
    socket_uuid: string;
}

export interface IRoomModel {
    uuid: string;
    user_list: Array<UserModel>
    user_to_player_map: Array<UserToPlayerMap>;
    game: GameModel;
    size: number;
}


export class RoomModel {
    uuid: string = "";
    user_list: Array<UserModel> = [];
    user_to_player_map: Array<UserToPlayerMap> = [];
    game: GameModel = new GameModel();
    size: number = 0;

    constructor(size: number) {
        this.size = size;
        this.uuid = uuidv4();
    }
}

export class RoomModelMap extends Mapper {
    public toDomain(raw: any): RoomModel {
        const room: RoomModel = new RoomModel(5);
        room.uuid = raw.uuid;
        room.size = raw.size;
        room.game = new GameModelMap().toDomain(raw.game);
        for (const user of raw.user_to_player_map) {
            room.user_to_player_map.push({
                user_uuid: user.user_uuid,
                player_uuid: user.player_uuid,
                socket_uuid: user.socket_uuid,
            });
        }
        const user_mapper: UserModelMap = new UserModelMap();
        for (const user of raw.user_list) {
            room.user_list.push(user_mapper.toDomain(user));
        }
        return room;
    }
}
