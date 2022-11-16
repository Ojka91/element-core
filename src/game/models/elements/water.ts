import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { AxisIncrement, isStrictOrthogonalPosition, orthogonal_increment_map } from "../position_utils";
import { Element } from "./elements";
import { Fire } from "./fire";

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
 export class Water extends Element{

    constructor(){
        super();
    }

    public ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Fire){
            return true;
        } 
        
        return false;
    }

    public reaction(
        grid: Grid,
        cell: Position,
        selected_river_pos_list?: Array<Position>,
        new_river_pos_list?: Array<Position>
        ): void {

            // Check if new water creates a River or is alone
            if(this.isWaterOrthogonallySurrounded(grid, cell) == false){
                // water standalone, do nothing
                return;
            }

            // It forms a river, is river data provided?
            if((new_river_pos_list == undefined) || (new_river_pos_list.length == 0)){
                throw new Error("Water reaction requires a new river array with at least 1 position. Got undefined or 0")
            }
            if((selected_river_pos_list == undefined) || (selected_river_pos_list.length == 0)){
                throw new Error("Water reaction requires a new river array with at least 1 position. Got undefined or 0")
            }
            // River data is provided, is it valid?
            if(this.isNewRiverValid(grid, new_river_pos_list!) && this.isValidRiver(grid, selected_river_pos_list!)){
                throw new Error("River data provided is invalid");
            }

            // River data provided is valid, is it a legal move?
            if(this.isRiverLegal(cell, selected_river_pos_list, new_river_pos_list)== false){
                throw new Error("River is illegal. Head or tail of the river must be opposite to the new water piece position")
            }

            // Add new river
            for (let pos of new_river_pos_list!){
                const water: Water = new Water();
                water.updatePosition(pos);
                grid.updateGridCell(water);
            }

            // Clear old river
            for (let pos of selected_river_pos_list!){
                grid.clearCell(pos);
            }
            
    }

    public isRiverOrthogonal(river_pos_list: Array<Position>): boolean {
        if(river_pos_list.length == 0){
            return false;
        }
        let temp_river: Array<Position> = river_pos_list.reverse();
        let previous_pos: Position = temp_river.pop()!;
        for (let pos of temp_river){
            if(isStrictOrthogonalPosition(previous_pos, pos) == false){
                return false;
            }
            previous_pos = pos;
        }
        return true;
    }

    public isValidRiver(grid: Grid, river_pos_list: Array<Position>): boolean {
        if(river_pos_list.length == 0){
            return false;
        }
        for(let water_pos of river_pos_list){
            if(grid.isWaterCell(water_pos) == false){
                return false;
            }
        }
        
        return this.isRiverOrthogonal(river_pos_list);
    }

    private isNewRiverValid(grid: Grid, river_pos_list: Array<Position>) {
        if(river_pos_list.length == 0){
            return false;
        }
        for(let pos of river_pos_list){
            if(grid.isPositionEmpty(pos) == false){
                if (this.ruleOfReplacement(grid.getGridCellByPosition(pos)) == false){
                    return false;
                }
            }
        }
        return this.isRiverOrthogonal(river_pos_list);
    }

    private isWaterOrthogonallySurrounded(grid: Grid, cell: Position): boolean {
        orthogonal_increment_map.forEach((value: AxisIncrement, key: string) => {
            const evaluate_pos: Position = {
                row: cell.row + value.y,
                column: cell.column + value.x
            };
            if(grid.isWaterCell(evaluate_pos)){
                return true;
            }
        });
        return false;
    }

    private isRiverLegal(cell: Position, river: Array<Position>, new_river: Array<Position>): boolean {
        if((isStrictOrthogonalPosition(cell, river[0]) == false) && (isStrictOrthogonalPosition(cell, river[river.length - 1]) == false)){
            return false;
        }
        return true
    }
}
