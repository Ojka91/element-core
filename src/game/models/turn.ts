import { ElementTypes } from "./elements/elements";

enum TurnStates {
    DrawingElements,
    MovesAvailables,
    EndTurn
}

const MAX_ALLOWED_ELEMENTS: number = 3;
const MIN_SAGE_MOVEMENTS: number = 2;

export class Turn {

    static MAX_ALLOWED_ELEMENTS: number = MAX_ALLOWED_ELEMENTS;
    static MIN_SAGE_MOVEMENTS: number = MIN_SAGE_MOVEMENTS;

    private chosen_elements: Array<ElementTypes> = [];
    private available_sage_moves: number = MIN_SAGE_MOVEMENTS;
    private state: TurnStates = TurnStates.DrawingElements;
    private player: number = 0; // Overrided later

    constructor(player_number: number){
        this.player = player_number;
    }

    public isEndOfTurn(): boolean {
        return this.state == TurnStates.EndTurn;
    }

    public isDrawingElementsAllowed(): boolean {
        return this.state == TurnStates.DrawingElements;
    }

    public isMovingSageAllowed(): boolean {
        return this.state == TurnStates.MovesAvailables && this.available_sage_moves > 0;
    }

    public isPlaceElementAllowed(): boolean {
        return this.state == TurnStates.MovesAvailables && this.chosen_elements.length > 0;
    }

    public setDrawnElements(elements: Array<ElementTypes>): void {
        this.chosen_elements = elements;
        this.available_sage_moves = MIN_SAGE_MOVEMENTS + MAX_ALLOWED_ELEMENTS - elements.length;
        this.state =TurnStates.MovesAvailables;
    }

    public getRemainingElements(): Array<ElementTypes> {
        return this.chosen_elements;
    }

    public removeElementFromList(element: ElementTypes): boolean {
        const removed: boolean = this.chosen_elements.splice(this.chosen_elements.indexOf(element), 1).length == 1;
        this.endOfTurnCheck();
        return removed;
    }

    private endOfTurnCheck(): void {
        if(this.chosen_elements.length == 0 && this.available_sage_moves == 0){
            this.state = TurnStates.EndTurn;
        }
    }

    public getPlayer() : number {
        return this.player;
    }

}