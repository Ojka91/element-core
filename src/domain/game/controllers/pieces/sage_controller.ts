import { SageModel } from "@/domain/game/models/pieces/sage";
import { Position } from "@/domain/game/utils/position_utils";
import { PieceController } from "./piece_controller";

const initial_position_2_players: Map<number, Position> = new Map([
    [0, { row: 4, column: 5 }],
    [1, { row: 6, column: 5 }]
]);

const initial_position_4_players: Map<number, Position> = new Map([
    [0, { row: 2, column: 2 }],
    [1, { row: 8, column: 2 }],
    [2, { row: 2, column: 8 }],
    [3, { row: 8, column: 8 }]
]);

const initial_position_map: Map<number, Map<number, Position>> = new Map([
    [2, initial_position_2_players],
    [3, initial_position_4_players],
    [4, initial_position_4_players]

])

export interface ISageController {
    getSageInitialPosition(number_of_players: number, player_number: number): Position;
}

export class SageController extends PieceController implements ISageController {
    /** Sage piece class */

    constructor(model: SageModel) {
        super(model);
    }

    public getSageInitialPosition(number_of_players: number, player_number: number): Position {
        return initial_position_map.get(number_of_players)!.get(player_number)!;
    }

}