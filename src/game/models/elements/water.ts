import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { Element } from "./elements";
import { Fire } from "./fire";

/**
 * Water class
 * @brief   Water can replace Fire.
 *          Placing multiple Water's orthogonally becomes a River. 
 *          Placing a Water next to orthogonally another water forms a River.
 *          Rivers must move orthogonally a number of spaces equal to the number of Water's in the River.
 *          River can only be made if its full number of spaces can be moved. Otherwise it's illegal.
 *          Wind, Water, Sage and Edges of the board block the River movement.
 *          Rivers can pass through Fire.
 */
 export class Water extends Element{
    private is_river: boolean = false;

    constructor(){
        super();
    }

    ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Fire){
            return true;
        } 
        
        return false;
    }

    public reaction(grid: Grid, cell: Position): void {
        console.log("react!")
    }
}
