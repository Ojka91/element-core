import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { Earth } from "./earth";
import { Element } from "./elements";

const MAX_STACKED_WINDS: number = 4;

/**
 * Wind class
 * @brief   Wind allows the sage to jump through the piece.
 *          Jumping thorugh Wind can be performed both diagonally and orthogonally
 *          Wind can replace Earth elements but NEVER replace Mountains.
 *          Stacking two Wind elements in the same piece will upgrade the element to Whirlwind
 */
 export class Wind extends Element{
    private stacked_winds: number = 1;

    constructor(){
        super();
    }

    public getNumberOfStackedWinds(): number {
        return this.stacked_winds;
    }

    ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Earth){
            return true;
        } else if (piece_to_replace instanceof Wind){
            if(this.stacked_winds <= MAX_STACKED_WINDS){
                this.stacked_winds++;
                return true;
            }
        }
        return false;
    }

    public reaction(grid: Grid, cell: Position): void {
        console.log("react!")
    }
}
