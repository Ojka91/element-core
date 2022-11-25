import { ElementTypes } from "./elements/elements";
import { Mapper } from "../utils/mapper";

export enum TurnStates {
    DrawingElements,
    MovesAvailables,
    EndTurn
}

export interface ITurnModel {
    chosen_elements: Array<ElementTypes>;
    available_sage_moves: number;
    state: TurnStates;
    player: number;
}

export class TurnModel implements ITurnModel {

    chosen_elements: Array<ElementTypes> = [];
    available_sage_moves: number = 0;
    state: TurnStates = TurnStates.DrawingElements;
    player: number = 0; // Overrided later

    constructor(player_number: number) {
        this.player = player_number;
    }
}

export class TurnModelMap extends Mapper {
    public toDomain(raw: any): ITurnModel {
        const turn: TurnModel = new TurnModel(0);
        turn.state = raw.state;
        turn.player = raw.player;
        turn.available_sage_moves = raw.available_sage_moves;
        turn.chosen_elements = raw.chosen_elements;
        return turn;
    }
}