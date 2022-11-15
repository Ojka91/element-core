import { Position } from "./grid";
import { Sage } from "./pieces";
import { SagePieceCreator } from "./pieces_factory";

export enum GameType {
    TwoPlayersGame = 2,
    FourPlayersGame = 4
};

export enum PlayerNumber {
    player_1 = 0,
    player_2 = 1,
    player_3 = 2,
    player_4 = 3
}

const SageInitialPositionMap_2Players: Position[] = [
    {row: 4, column: 5},
    {row: 6, column: 5}
];

const SageInitialPositionMap_4Players: Position[] = [
    {row: 2, column: 2},
    {row: 8, column: 2},
    {row: 2, column: 8},
    {row: 8, column: 8}
];


class Player {
    private uuid: string;
    private sage: Sage;

    constructor(player_number: PlayerNumber, game_players: GameType){
        
        this.uuid = "Player "+player_number;
        this.sage = this.generateSage(player_number, game_players);
    }

    public getSage(): Sage{
        return this.sage;
    }

    public getUuid(): string{
        return this.uuid;
    }

    private generateSage(player_number: PlayerNumber, game_players: GameType): Sage {
        
        let mapper: Position[];
        let sage = new SagePieceCreator().createPiece();
        
        switch(game_players){
            case GameType.TwoPlayersGame:
                if(player_number >= GameType.TwoPlayersGame){
                    throw(new Error("Player number cannot be greater than allowed players in a Game"));
                }
                mapper = SageInitialPositionMap_2Players;
                break;
            case GameType.FourPlayersGame:
                mapper = SageInitialPositionMap_4Players;
                break;
        }

        sage.updatePosition(mapper[player_number]);

        return sage;
    }
}

export default Player;