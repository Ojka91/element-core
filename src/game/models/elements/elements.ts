import { PieceModel, PieceModelMap } from "../pieces/pieces";

/** mapping of the element to the corresponding class */
export enum ElementTypes {
    Fire = "Fire",
    Water = "Water",
    Earth = "Earth",
    Wind = "Wind"
};


/** Abstract class for all elements */
export abstract class ElementModel extends PieceModel {

    constructor() {
        super();
    }
}

export abstract class ElementModelMap extends PieceModelMap {
}
