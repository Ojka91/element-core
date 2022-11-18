import { Grid, Position } from "./grid";
import { ElementTypes } from "./elements/elements";
import ElementPoolManager from "./element_pool_manager";
import Player from "./player";
import { MovementManager } from "./movement_manager";

const COLUMN_PIECES_WIDTH: number = 11;
const ROW_PIECES_HEIGHT: number = 11;

class Board {
    private grid: Grid = new Grid(ROW_PIECES_HEIGHT, COLUMN_PIECES_WIDTH);
    elementPool: ElementPoolManager = new ElementPoolManager();

    public addPlayer(player: Player){
        let sage = player.getSage();
        this.grid.updateGridCell(sage);
    }

    public returnElementToPool(element: ElementTypes): void {
        this.elementPool.addElement(element);
    }

    public getElementFromPool(element: ElementTypes): void {
        this.elementPool.removeElement(element);
    }

    /** Grid getter */
    public getGrid(): Grid {
        return this.grid;
    }

    /** Method to place the player sage in the board */
    public placePlayerSage(player: Player, new_position: Position): void {
        let sage = player.getSage();
        if (( new_position.column >= COLUMN_PIECES_WIDTH) || (new_position.row >= ROW_PIECES_HEIGHT)){
            throw new Error("Incorrect new row or new column dimensions");
        }
        if(MovementManager.isSageMoveValid(this.grid, sage.position, new_position) == false){
            throw new Error("Sage movement is not valid");
        }
        sage.updatePosition(new_position);
        this.grid.updateGridCell(sage);
    }

    public displayGrid(): void {
        this.grid.displayGrid();
    }
    
}

export default Board;