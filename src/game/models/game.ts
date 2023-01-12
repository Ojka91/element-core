import { BoardModel, BoardModelMap } from "./board";
import { Mapper } from "@/game/utils/mapper";
import { PlayerModel, PlayerModelMap } from "./player";
import { TurnModel, TurnModelMap } from "./turn";

export enum GameStates {
    NewGame,
    GameRunning,
    EndGame
}

export enum GameType {
    TwoPlayersGame = 2,
    ThreePlayersGame = 3,
    FourPlayersGame = 4
};

export interface IGameModel {
    state: GameStates,
    player_list: Array<PlayerModel>,
    board: BoardModel,
    turn: TurnModel,
    game_type: GameType,
    loser_uuid: string,
}

export class GameModel implements IGameModel {

    state: GameStates = GameStates.NewGame;
    player_list: Array<PlayerModel> = [];
    board: BoardModel = new BoardModel();
    turn: TurnModel = new TurnModel(0); // default overrided later
    game_type: GameType = GameType.TwoPlayersGame; // default overrided later
    loser_uuid: string = "";

}

export class GameModelMap extends Mapper {
    public toDomain(raw: any): GameModel {
        const game: GameModel = new GameModel();
        game.state = raw.state;
        game.game_type = raw.game_type;
        game.loser_uuid = raw.loser_uuid;
        game.board = new BoardModelMap().toDomain(raw.board);
        game.turn = new TurnModelMap().toDomain(raw.turn);
        const player_mapper: PlayerModelMap = new PlayerModelMap();
        for (let player of raw.player_list) {
            game.player_list.push(player_mapper.toDomain(player));
        }
        return game;
    }

    public toDao(obj: IGameModel): string {
        return JSON.stringify(obj)
    }
}