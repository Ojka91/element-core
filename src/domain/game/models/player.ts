import { v4 as uuidv4 } from 'uuid';
import { Mapper } from '../utils/mapper';
import { ISageModel, SageModel, SageModelMap } from "./pieces/sage";

export interface IPlayerModel {
    uuid: string;
    player_number: number;
    sage: ISageModel;
    target: number;
    consecutiveSkippedTurns: number;
}

export class PlayerModel implements IPlayerModel {
    uuid: string;
    player_number: number;
    sage: ISageModel;
    target: number = 0;
    consecutiveSkippedTurns: number = 0;

    constructor(player_number: number) {

        this.player_number = player_number;
        this.sage = new SageModel();
        this.uuid = uuidv4();
    }
}

export class PlayerModelMap extends Mapper{
    public toDomain(raw: any): PlayerModel {
        const player: PlayerModel = new PlayerModel(0);
        player.player_number = raw.player_number;
        player.sage = new SageModelMap().toDomain(raw.sage);
        player.uuid = raw.uuid;
        player.target = raw.target;
        player.consecutiveSkippedTurns = raw.consecutiveSkippedTurns;
        return player;
    }
}