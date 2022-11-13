import { Sage } from "./pieces";
import { SagePieceCreator } from "./pieces_factory";

const SAGE_1_ROW_2PLAYER: number = 4;
const SAGE_1_COLUMN_2PLAYER: number = 5;
const SAGE_2_ROW_2PLAYER: number = SAGE_1_ROW_2PLAYER + 2;
const SAGE_2_COLUMN_2PLAYER: number = SAGE_1_COLUMN_2PLAYER;

const SageInitialPositionMap_2Players = [
    {row: 4, column: 5},
    {row: 6, column: 5}
];

class Player {
    private uuid: String;
    private sage: Sage;

    constructor(player_number: number){
        let column;
        let row;
        
        this.uuid = "Player "+player_number;

        this.sage = new SagePieceCreator().createPiece();
        
        row = SageInitialPositionMap_2Players[player_number].row;
        column = SageInitialPositionMap_2Players[player_number].column;

        this.sage.updatePosition(row, column);
    }
}

export default Player;