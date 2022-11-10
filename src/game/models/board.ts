import { EmptyCreator, Piece, SageCreator } from "./pieces";

const COLUMN_PIECES_WIDTH: number = 11;
const ROW_PIECES_HEIGHT: number = 11;

const SAGE_1_ROW_2PLAYER: number = 5;
const SAGE_1_COLUMN_2PLAYER: number = 6;
const SAGE_2_ROW_2PLAYER: number = ROW_PIECES_HEIGHT - SAGE_1_ROW_2PLAYER;
const SAGE_2_COLUMN_2PLAYER: number = COLUMN_PIECES_WIDTH - SAGE_1_COLUMN_2PLAYER;


class Board {
    grid: Piece[][];

    constructor(){
        let grid = new Array(COLUMN_PIECES_WIDTH);
        for (let row = 0; row < COLUMN_PIECES_WIDTH; row++) {
            grid[row] = new Array(ROW_PIECES_HEIGHT);
            grid[row].fill(new EmptyCreator().createPiece());
        }
        this.grid = grid;
    }

    placePlayerSage(player_number: number){
        switch(player_number){
            case 1:
                this.grid[SAGE_1_ROW_2PLAYER][SAGE_1_COLUMN_2PLAYER] = new SageCreator().createPiece();
                break;
            case 2:
                this.grid[SAGE_2_ROW_2PLAYER][SAGE_2_COLUMN_2PLAYER] = new SageCreator().createPiece();
                break;
            default:
                break;
        }
    }

    displayGrid(){
        for (var row of this.grid){
            for (var column of row){
                console.log(column);
            }
        }
    }
}

export default Board;