import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { AxisIncrement, isSamePosition, isStrictOrthogonalPosition, orthogonal_increment_map } from "../position_utils";
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

    /** Water reaction
     * Both selected river and new river are optionals since not always a river is formed.
     * Rivers must be sorted and have their head as the first element in the array.
     * 
     * NOTE:    A river head is the nearest position to the cell. Therefore rivers are always formed as head-to-tail
     *          where the head is the nearest position to the water placed and the tail is the further water.
     */
    public reaction(
        grid: Grid,
        cell: Position,
        curr_river?: Array<Position>,  // must be sorted and head must be the first element
        new_river?: Array<Position>        // must be sorted and head must be the first element
        ): void {

            const surr_waters: Array<Position> = this.getSurroundingWaters(grid, cell);
            // Check if new water creates a River or is alone
            if( surr_waters.length == 0){
                // water standalone, do nothing
                return;
            }

            // It forms a river, is river data provided?
            if((new_river == undefined) || (new_river.length == 0)){
                throw new Error("Water reaction requires a new river array with at least 1 position. Got undefined or 0")
            }
            if((curr_river == undefined) || (curr_river.length == 0)){
                throw new Error("Water reaction requires an old river array with at least 1 position. Got undefined or 0")
            }

            const selected_river_pos_list: Array<Position> = JSON.parse(JSON.stringify(curr_river));
            const new_river_pos_list: Array<Position> = JSON.parse(JSON.stringify(new_river));

            if(new_river_pos_list.length - 1 != selected_river_pos_list.length){
                throw new Error("New river must have the old river length + 1")
            }

            // River data are a legal move?
            if(this.isRiverLegal(cell, selected_river_pos_list, new_river_pos_list)== false){
                throw new Error("River is illegal. Heads of the rivers must be opposite to the new water piece position")
            }

            // Add placed water to the old river list
            selected_river_pos_list.unshift(cell);

            // New river data is provided, is it valid?
            if(this.isNewRiverValid(grid, new_river_pos_list!) == false){
                throw new Error("New river data provided is invalid");
            }
            // River data is provided, is it valid?
            if(this.isValidRiver(grid, selected_river_pos_list!) == false){
                throw new Error("River data provided is invalid");
            }

            // Clear old river
            for (let pos of selected_river_pos_list!){
                grid.clearCell(pos);
            }

            // Add new river
            for (let pos of new_river_pos_list!){
                const water: Water = new Water();
                water.updatePosition(pos);
                grid.updateGridCell(water);
            }
            
    }

    private isRiverOrthogonal(river_pos_list: Array<Position>): boolean {
        let previous_pos: Position | null = null;
        for (let pos of river_pos_list){
            if(previous_pos != null){
                if(isStrictOrthogonalPosition(previous_pos, pos) == false){
                    return false;
                }
            }
            previous_pos = pos;
        }
        return true;

    }

    private isValidRiver(grid: Grid, river_pos_list: Array<Position>): boolean {
        for(let water_pos of river_pos_list){
            if(grid.isWaterCell(water_pos) == false){
                return false;
            }
        }
        return this.isRiverOrthogonal(river_pos_list);
    }

    private isNewRiverValid(grid: Grid, river_pos_list: Array<Position>) : boolean {
        for(let pos of river_pos_list){
            if(grid.isPositionEmpty(pos) == false){
                if (this.ruleOfReplacement(grid.getGridCellByPosition(pos)) == false){
                    return false;
                }
            }
        }
        return this.isRiverOrthogonal(river_pos_list);
    }

    private getSurroundingWaters(grid: Grid, cell: Position): Array<Position> {
        let surr_waters_position: Array<Position> = [];
        orthogonal_increment_map.forEach((value: AxisIncrement, key: string) => {
            const evaluate_pos: Position = {
                row: cell.row + value.y,
                column: cell.column + value.x
            };
            if(grid.isWaterCell(evaluate_pos)){
                surr_waters_position.push(evaluate_pos);
            }
        });
        return surr_waters_position;
    }

    /** Check whether the head of both river and new river are orthogonal to cell position */
    private isRiverLegal(cell: Position, river: Array<Position>, new_river: Array<Position>): boolean {
        const river_head: Position = river[0];
        const new_river_head: Position = new_river[0];
        
        /*if(isSamePosition(river_head, new_river_head)){
            return false;
        }*/
        // Check if heads are strictly orthogonal to the cell
        if(isStrictOrthogonalPosition(cell, river_head) && isStrictOrthogonalPosition(cell, new_river_head)){
            return true;
        }
        return false;
    }
}
