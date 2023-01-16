import { UserModel, UserModelMap } from "./user";
import { GameModel, GameModelMap } from "./game";
import { Mapper } from "@/game/utils/mapper";

import { v4 as uuidv4 } from 'uuid';

export type UserToPlayerMap = {
    user_uuid: string;
    player_uuid: string;
    user_name: string;
}

export interface IRoomModel {
    uuid: string;
    user_list: Array<UserModel>
    user_to_player_map: Array<UserToPlayerMap>;
    game: GameModel;
    size: number;
}

// This interface exist so we dont leak user details data to the whole room
export interface IRoomModelSecured {
    uuid: string;
    user_list: Array<Partial<UserModel>>
    user_to_player_map: Array<Partial<UserToPlayerMap>>
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
        for (let user of raw.user_to_player_map) {
            room.user_to_player_map.push({
                user_uuid: user.user_uuid,
                player_uuid: user.player_uuid,
                user_name: user.user_name,
            });
        }
        const user_mapper: UserModelMap = new UserModelMap();
        for (let user of raw.user_list) {
            room.user_list.push(user_mapper.toDomain(user));
        }
        return room;
    }

    public toSecured(raw: RoomModel): IRoomModelSecured {
        const room: IRoomModelSecured = new RoomModel(5);
        room.uuid = raw.uuid;
        room.size = raw.size;
        room.game = new GameModelMap().toDomain(raw.game);
        for (let user of raw.user_to_player_map) {
            room.user_to_player_map.push({
                user_name: user.user_name
            });
        }
        for (let user of raw.user_list) {
            room.user_list.push({name: user.name});
        }
        return room;
    }
}
