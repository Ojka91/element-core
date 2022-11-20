import { Grid, Position } from "./grid";
import { ElementTypes } from "./elements/elements";
import ElementPoolManager from "./element_pool_manager";
import Player from "./player";
import { MovementManager } from "./movement_manager";
import { Sage } from "./pieces";
import { SagePieceCreator } from "./pieces_factory";
import { GameType } from "./game_utils";

const COLUMN_PIECES_WIDTH: number = 11;
const ROW_PIECES_HEIGHT: number = 11;

class Board {

    private grid: Grid = new Grid(ROW_PIECES_HEIGHT, COLUMN_PIECES_WIDTH);
    private sage_list: Array<Sage> = [];
    public elementPool: ElementPoolManager = new ElementPoolManager();


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

    /** Method to create the sages for the players */
    public createSageByPlayerAndGameType(player: Player, game_type: GameType): void {
        const sage: Sage = new SagePieceCreator().createPiece();
        sage.updatePosition(Sage.initial_position_map.get(game_type)!.get(player.getPlayerNumber())!)
        player.setSage(sage);
        this.grid.updateGridCell(player.getSage());
    }

    /** Method to place the player sage in the board */
    public placePlayerSage(player: Player, new_position: Position): void {
        let sage = player.getSage();
        if (this.grid.isPositionValid(new_position) == false){
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