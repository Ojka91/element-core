import { ElementTypes } from "@/domain/game/models/elements/elements";
import { FireModel } from "@/domain/game/models/elements/fire";
import { WaterModel } from "@/domain/game/models/elements/water";
import { IGridModel } from "@/domain/game/models/grid";
import { IPieceModel } from "@/domain/game/models/pieces/pieces";
import { AxisIncrement, Position, PositionUtils } from "@/domain/game/utils/position_utils";
import ElementPoolManager from "../element_pool_controller";
import GridController from "../grid_controller";
import { ElementController, IElementController } from "./elements_controller";

/**
 * Water class
 * @brief   Water can replace Fire.
 *          Placing multiple Water's orthogonally becomes a River. 
 *          Placing a Water next to orthogonally another water forms a River.
 *          Rivers must move orthogonally a number of spaces equal to the number of Water's in the River.
 *          River can only be made if its full number of spaces can be moved. Otherwise it's illegal.
 *          Wind, Water, Sage and Edges of the board block the River movement.
 *          Rivers can pass through Fire.
 */
export interface IWaterController extends IElementController {
    ruleOfReplacement(piece_to_replace: IPieceModel, element_pool_manager: ElementPoolManager): boolean
    reaction(grid: IGridModel, cell: Position, curr_river?: Array<Position>, new_river?: Array<Position>, element_pool_manager?: ElementPoolManager): void;
}

export class WaterController extends ElementController implements IWaterController {

    protected model: WaterModel;

    constructor(model: WaterModel) {
        super(model);
        this.model = model
    }

    public ruleOfReplacement(piece_to_replace: IPieceModel, element_pool_manager: ElementPoolManager): boolean {
        if (piece_to_replace instanceof FireModel) {
            element_pool_manager.addElement(ElementTypes.Fire);
            return true;
        }

        return false;
    }

    /** Water reaction
     * Both selected river and new river are optionals since not always a river is formed.
     * Rivers must be sorted and have their head as the first element in the array.
     * 
     * NOTE:    A river head is the nearest position to the cell. Therefore rivers are always formed as head-to-tail
     *          where the head is the nearest position to the water placed and the tail is the further water.
     */
    public reaction(
        grid: IGridModel,
        cell: Position,
        curr_river?: Array<Position>,  // must be sorted and head must be the first element
        new_river?: Array<Position>,        // must be sorted and head must be the first element
        element_pool_manager?: ElementPoolManager
    ): void {

        const surr_waters: Array<Position> = this.getSurroundingWaters(grid, cell);
        // Check if new water creates a River or is alone
        if (surr_waters.length == 0) {
            // water standalone, do nothing
            return;
        }

        // It forms a river, is river data provided?
        if ((new_river == undefined) || (new_river.length == 0)) {
            throw new Error("Water reaction requires a new river array with at least 1 position. Got undefined or 0")
        }
        if ((curr_river == undefined) || (curr_river.length == 0)) {
            throw new Error("Water reaction requires an old river array with at least 1 position. Got undefined or 0")
        }

        const selected_river_pos_list: Array<Position> = JSON.parse(JSON.stringify(curr_river));
        const new_river_pos_list: Array<Position> = JSON.parse(JSON.stringify(new_river));

        if (new_river_pos_list.length - 1 != selected_river_pos_list.length) {
            throw new Error("New river must have the old river length + 1")
        }

        // River data are a legal move?
        if (this.isRiverLegal(cell, selected_river_pos_list, new_river_pos_list) == false) {
            throw new Error("River is illegal. Heads of the rivers must be opposite to the new water piece position")
        }

        // Add placed water to the old river list
        selected_river_pos_list.unshift(cell);

        // New river data is provided, is it valid?
        if (this.isNewRiverValid(grid, new_river_pos_list!, element_pool_manager as ElementPoolManager) == false) {
            throw new Error("New river data provided is invalid");
        }
        // River data is provided, is it valid?
        if (this.isValidRiver(grid, selected_river_pos_list!) == false) {
            throw new Error("River data provided is invalid");
        }

        const grid_controller: GridController = new GridController(grid);
        // Clear old river
        for (const pos of selected_river_pos_list!) {
            grid_controller.clearCell(pos);
        }

        // Add new river
        for (const pos of new_river_pos_list!) {
            const water: WaterModel = new WaterModel();
            new WaterController(water).updatePosition(pos);
            grid_controller.updateGridCell(water);
        }

    }

    private isRiverOrthogonal(river_pos_list: Array<Position>): boolean {
        let previous_pos: Position | null = null;
        for (const pos of river_pos_list) {
            if (previous_pos != null) {
                if (PositionUtils.isStrictOrthogonalPosition(previous_pos, pos) == false) {
                    return false;
                }
            }
            previous_pos = pos;
        }
        return true;

    }

    private isValidRiver(grid: IGridModel, river_pos_list: Array<Position>): boolean {
        const grid_controller: GridController = new GridController(grid);
        for (const water_pos of river_pos_list) {
            if (grid_controller.isWaterCell(water_pos) == false) {
                return false;
            }
        }
        return this.isRiverOrthogonal(river_pos_list);
    }

    private isNewRiverValid(grid: IGridModel, river_pos_list: Array<Position>, element_pool_manager: ElementPoolManager): boolean {
        const grid_controller: GridController = new GridController(grid);
        for (const pos of river_pos_list) {
            if (grid_controller.isPositionEmpty(pos) == false) {
                if (this.ruleOfReplacement(grid_controller.getGridCellByPosition(pos), element_pool_manager) == false) {
                    return false;
                }
            }
        }
        return this.isRiverOrthogonal(river_pos_list);
    }

    private getSurroundingWaters(grid: IGridModel, cell: Position): Array<Position> {
        const grid_controller: GridController = new GridController(grid);
        const surr_waters_position: Array<Position> = [];
        PositionUtils.orthogonal_increment_map.forEach((value: AxisIncrement, key: string) => {
            const evaluate_pos: Position = {
                row: cell.row + value.y,
                column: cell.column + value.x
            };
            if (grid_controller.isPositionValid(evaluate_pos) && grid_controller.isWaterCell(evaluate_pos)) {
                surr_waters_position.push(evaluate_pos);
            }
        });
        return surr_waters_position;
    }

    /** Check whether the head of both river and new river are orthogonal to cell position */
    private isRiverLegal(cell: Position, river: Array<Position>, new_river: Array<Position>): boolean {
        const river_head: Position = river[0];
        const new_river_head: Position = new_river[0];

        /*if(PositionUtils.isSamePosition(river_head, new_river_head)){
            return false;
        }*/
        // Check if heads are strictly orthogonal to the cell
        if (PositionUtils.isStrictOrthogonalPosition(cell, river_head) && PositionUtils.isStrictOrthogonalPosition(cell, new_river_head)) {
            return true;
        }
        return false;
    }

    public getRivers(grid: IGridModel, cell: Position): Array<Array<Position>> {
        const grid_controller = new GridController(grid);
        const rivers: Array<Array<Position>> = [];

        // First we will check all 4 orthogonal directions
        PositionUtils.orthogonal_increment_map.forEach((value: AxisIncrement) => {
            const evaluate_pos: Position = {
                row: cell.row + value.y,
                column: cell.column + value.x
            };

            // New possible river starts with new placed water
            let evaluating_river: Array<Position> = []


            // We check if next piece on one direction is water. While it's water, it creates a river
            while (grid_controller.isPositionValid(evaluate_pos) && grid_controller.isWaterCell(evaluate_pos)) {

                evaluating_river.push({ row: evaluate_pos.row, column: evaluate_pos.column });
                evaluate_pos.column = evaluate_pos.column + value.x;
                evaluate_pos.row = evaluate_pos.row + value.y;

            }
            // If evaluating river contains only placed cell (lenght = 1) is not a river...
            if (evaluating_river.length > 0) {
                rivers.push(evaluating_river);
                evaluating_river = []
            }


        });

        return rivers;

    }
}
