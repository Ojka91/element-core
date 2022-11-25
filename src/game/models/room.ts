import { UserModel, UserModelMap } from "./user";
import { GameModel, GameModelMap } from "./game";
import { Mapper } from "@/game/utils/mapper";

import {v4 as uuidv4} from 'uuid';

export interface IRoomModel {
    uuid: string;
    user_list: Array<UserModel>
    user_to_player_map: Map<string, string>;
    game: GameModel;
    size: number;
}

export class RoomModel {
    uuid: string = ""
    user_list: Array<UserModel> = []
    user_to_player_map: Map<string, string> = new Map();
    game: GameModel = new GameModel();
    size: number = 0;

    constructor(){
        this.uuid = uuidv4();
    }
}

export class RoomModelMap extends Mapper{
    public toDomain(raw: any): RoomModel {
        const room: RoomModel = new RoomModel();
        room.uuid = raw.uuid;
        room.size = raw.size;
        room.game = new GameModelMap().toDomain(raw.game);
        room.user_to_player_map = raw.user_to_player_map;

        const user_mapper: UserModelMap = new UserModelMap();
        for(let user of raw.user_list){
            room.user_list.push(user_mapper.toDomain(user));
        }
        return room
    }
}
