import Board from "../board";
import { Piece } from "../pieces";
import { Element, ElementCreator } from "./elements";
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
        const piece_name = piece_to_replace.constructor.name;
        if(piece_name == Wind.constructor.name){
            return true;
        }
        return false;
    }

    reaction(board: Board): void {
        /* TBD */
        console.log("Fire reaction!")
    }
}

/**
 * FireCreator override the factory method in order to change the
 * resulting piece's type.
 */
 export class FireCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Fire();
    }
}
