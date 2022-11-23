import { GameType } from "./game_utils";
import { Position } from "./grid";
import {v4 as uuidv4} from 'uuid';

export abstract class Piece {
    position: Position = {
        row: 0,
        column: 0
    };

    // debugging purposes
    string_representation: string = "";

    updatePosition(new_position: Position){
        this.position = new_position;
    }
}

export class Empty extends Piece {
    /** Empty piece class */
    constructor(){
        super();
        this.string_representation = " "
    }
}

export class Sage extends Piece {
    /** Sage piece class */
    private static initial_position_2_players: Map<number, Position> = new Map([
        [0, {row: 4, column: 5}],
        [1, {row: 6, column: 5}]
    ]);
    
    private static initial_position_4_players: Map<number, Position> = new Map([
        [0, {row: 2, column: 2}],
        [1, {row: 8, column: 2}],
        [2, {row: 2, column: 8}],
        [3, {row: 8, column: 8}]
    ]);
    
    public static initial_position_map: Map<GameType, Map<number, Position> > = new Map([
        [GameType.TwoPlayersGame, this.initial_position_2_players],
        [GameType.ThreePlayersGame, this.initial_position_4_players],
        [GameType.FourPlayersGame, this.initial_position_4_players]
    
    ])
    uuid: string;

    constructor(){
        super();
        this.uuid = uuidv4();
        this.string_representation = "S"
    }

}
