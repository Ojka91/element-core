import Board from "../board";
import { Piece } from "../pieces";
import { EarthCreator } from "./earth";
import { FireCreator } from "./fire";
import { WaterCreator } from "./water";
import { WindCreator } from "./wind";

/** mapping of the element to the corresponding class */
export enum ElementTypes {
    Fire = "Fire",
    Water = "Water",
    Earth = "Earth",
    Wind = "Wind"
};

export const ElementFactoryMap = {
    "Fire": FireCreator,
    "Water": WaterCreator,
    "Earth": EarthCreator,
    "Wind": WindCreator
};


/** Abstract class for all elements */
export abstract class Element extends Piece {
    
    constructor(){
        super();
    }
    
    /** All Elements has their own rule of replacement, this function return if it's allowed to be replace the piece with the element */
    abstract ruleOfReplacement(piece_to_replace: Piece): boolean

    /** Reaction function to be executed when an Element is placed which can generate changes on the board */
    abstract reaction(board: Board): void
}

/**
 * The ElementCreator class declares the factory method that is supposed to return an
 * object of a Element class. The ElementCreator's subclasses usually provide the
 * implementation of this method.
 */
 export abstract class ElementCreator {
    /**
     * Note that the ElementCreator may also provide some default implementation of the
     * factory method.
     */
    public abstract factoryMethod(): Element;
    /**
     * Also note that, despite its name, the ElementCreator's primary responsibility is
     * not creating elements. Usually, it contains some core business logic that
     * relies on Element objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of element from it.
     */
    public createElement(): Element {
        // Call the factory method to create an Element object.
        const element = this.factoryMethod();
        // Now, use the product.
        return element;
    }

}
