import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { Element } from "./elements";
import { Wind } from "./wind";

/**
 * Fire class
 * @brief   Once placed next to other fire element it reacts adding one extra Fire in the opposite side of the already placed fire.
 *          If a Water, Earth/Mountain or Sage occupies the opposite space, NO extra Fire is added. If it is Wind/Whirlwind element then Wind is replaced by Fire.
 *          Extra Fire elements can only be placed orthogonally, NEVER diagonally.
 *          Extra Fire elements do not generate extra Fire elements.
 */
 export class Fire extends Element{

    constructor(){
        super();
    }

    ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Wind){
            return true;
        }
        return false;
    }

    reaction(grid: Grid, cell: Position): void {
        this.propagate(grid, cell);
    }

    private propagate(grid: Grid, cell: Position): void {
        console.log("propagate!")
    }
}
