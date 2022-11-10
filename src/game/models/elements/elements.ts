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

    /** Reaction function to be executed when an Element is placed which can generate changes on the board */
    abstract reaction(): void
}
