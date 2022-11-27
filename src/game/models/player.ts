import { v4 as uuidv4 } from 'uuid';
import { Mapper } from '../utils/mapper';
import { ISageModel, SageModelMap } from "./pieces/sage";

export interface IPlayerModel {
    uuid: string;
    player_number: number;
    sage: ISageModel;
}

export class PlayerModel {
    uuid: string;
    player_number: number;
    sage?: ISageModel;

    constructor(player_number: number) {

        this.player_number = player_number;
        this.uuid = uuidv4();
    }
}

export class PlayerModelMap extends Mapper{
    public toDomain(raw: any): PlayerModel {
        const player: PlayerModel = new PlayerModel(0);
        player.player_number = raw.player_number;
        player.sage = new SageModelMap().toDomain(raw.sage);
        player.uuid = raw.uuid;
        return player;
    }
}