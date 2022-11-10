import Board from "../board";
import { Piece } from "../pieces";
import { Element, ElementCreator } from "./elements";
import { Water } from "./water";

/**
 * Earth class
 * @brief   Earth blocks the sage to move.
 *          Stacking two Earth's it becomes a Mountain. 
 *          Water elements can be replaced by Earth.
 *          Earth elements can be replaced by Wind unless they became a Mountain.
 *          Any Earth connected orthogonally or diagonally to a Mountain
 *          become a Range and share the same properties as a Mountain.
 *          A Range blocks the Sage to move diagonally.
 */
 export class Earth extends Element{
    private is_mountain: boolean = false;
    private is_range: boolean = false;

    constructor(){
        super();
    }

    ruleOfReplacement(piece_to_replace: Piece): boolean {
        const piece_name = piece_to_replace.constructor.name;
        if(piece_name == Water.constructor.name){
            return true;
        } 
        if (piece_name == Earth.constructor.name){
            if (this.is_mountain == false){
                this.is_mountain = true;
                this.is_range = true;
                return true;
            }
        }
        return false;
    }

    reaction(board: Board): void {
        /* TBD */
        console.log("Earth reaction!");
    }
}

/**
 * EarthCreator override the factory method in order to change the
 * resulting piece's type.
 */
 export class EarthCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Earth();
    }
}
