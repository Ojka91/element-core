import ElementPoolManager from "../element_pool_manager";
import Grid, { Position } from "../grid";
import { Piece } from "../pieces";

/** mapping of the element to the corresponding class */
export enum ElementTypes {
    Fire = "Fire",
    Water = "Water",
    Earth = "Earth",
    Wind = "Wind"
};


/** Abstract class for all elements */
export abstract class Element extends Piece {
    
    constructor(){
        super();
    }

    /** All Elements has their own rule of replacement, this function return if it's allowed to be replace the piece with the element */
    abstract ruleOfReplacement(piece_to_replace: Piece): boolean

    /** Reaction of placing the element into the board */
    abstract reaction(grid: Grid, cell: Position): void

    /** Function to place the element into a grid */
    public place(grid: Grid, cell: Position): boolean {
        const piece: Piece = grid.getGridCellByPosition(cell);
        if(grid.isPositionEmpty(cell) || (this.ruleOfReplacement(piece))){
            this.position = cell;
            grid.updateGridCell(this)
            return true;
        }
        
        return false;
    }
}
