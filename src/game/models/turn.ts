import { ElementTypes } from "./elements/elements";

export class Turn {

    static MAX_ALLOWED_ELEMENTS: number = 3;
    static MIN_SAGE_MOVEMENTS: number = 2;

    chosen_elements: Array<ElementTypes> = [];
    available_sage_moves: number = 2;

}