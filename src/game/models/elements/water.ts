import Board from "../board";
import { Piece } from "../pieces";
import { Element, ElementCreator } from "./elements";
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
        const piece_name = piece_to_replace.constructor.name;
        if(piece_name == Fire.constructor.name){
            return true;
        } 
        
        return false;
    }

    reaction(board: Board): void {
        /* TBD */
        console.log("Water reaction!");
    }
}

/**
 * WaterCreator override the factory method in order to change the
 * resulting piece's type.
 */
 export class WaterCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Water();
    }
}
