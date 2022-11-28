import { ElementTypes } from "../models/elements/elements";
import { ITurnModel, TurnStates } from '../models/turn'

const MAX_ALLOWED_ELEMENTS: number = 3;
const MIN_SAGE_MOVEMENTS: number = 2;

export interface ITurnController {
    isEndOfTurn(): boolean ;
    isDrawingElementsAllowed(): boolean ;
    isMovingSageAllowed(): boolean ;
    isPlaceElementAllowed(): boolean ;
    isNumberOfDrawnElementsAllowed(num_draw_elements: number): boolean ;
    setDrawnElements(elements: Array<ElementTypes>): void ;
    getRemainingElements(): Array<ElementTypes> ;
    removeElementFromList(element: ElementTypes): boolean ;
    getPlayer(): number ;
}

export class TurnController implements ITurnController{

    private model: ITurnModel;

    constructor(model: ITurnModel) {
        this.model = model;
    }

    public isEndOfTurn(): boolean {
        return this.model.state == TurnStates.EndTurn;
    }

    public isDrawingElementsAllowed(): boolean {
        return this.model.state == TurnStates.DrawingElements;
    }

    public isMovingSageAllowed(): boolean {
        return this.model.state == TurnStates.MovesAvailables && this.model.available_sage_moves > 0;
    }

    public isPlaceElementAllowed(): boolean {
        return this.model.state == TurnStates.MovesAvailables && this.model.chosen_elements.length > 0;
    }

    public isNumberOfDrawnElementsAllowed(num_draw_elements: number): boolean {
        return num_draw_elements <= MAX_ALLOWED_ELEMENTS;
    }

    public setDrawnElements(elements: Array<ElementTypes>): void {
        this.model.chosen_elements = elements;
        this.model.available_sage_moves = MIN_SAGE_MOVEMENTS + MAX_ALLOWED_ELEMENTS - elements.length;
        this.model.state = TurnStates.MovesAvailables;
    }

    public getRemainingElements(): Array<ElementTypes> {
        return this.model.chosen_elements;
    }

    public removeElementFromList(element: ElementTypes): boolean {
        const removed: boolean = this.model.chosen_elements.splice(this.model.chosen_elements.indexOf(element), 1).length == 1;
        this.endOfTurnCheck();
        return removed;
    }

    private endOfTurnCheck(): void {
        if (this.model.chosen_elements.length == 0 && this.model.available_sage_moves == 0) {
            this.model.state = TurnStates.EndTurn;
        }
    }

    public getPlayer(): number {
        return this.model.player;
    }

}