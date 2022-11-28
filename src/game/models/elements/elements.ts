import { IPieceModel, PieceModel, PieceModelMap } from "../pieces/pieces";

/** mapping of the element to the corresponding class */
export enum ElementTypes {
    Fire = "Fire",
    Water = "Water",
    Earth = "Earth",
    Wind = "Wind"
};

export interface IElementModel extends IPieceModel {
    element_type: ElementTypes;
}

/** Abstract class for all elements */
export abstract class ElementModel extends PieceModel {
    
    element_type: ElementTypes = ElementTypes.Fire;

    constructor() {
        super();
    }
}

export abstract class ElementModelMap extends PieceModelMap {
}
