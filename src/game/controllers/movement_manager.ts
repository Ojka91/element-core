
import { WindModel } from "../models/elements/wind";
import { PositionUtils, Position } from "@/game/utils/position_utils"
import { IGridModel } from "@/game/models/grid";
import GridController from "./grid_controller";
import { WindController } from "./elements/wind_controller";

export class MovementManager {
    
    public static isWindBlocked(grid: IGridModel, origin: Position, wind: WindModel): boolean {
        
        const grid_controller: GridController = new GridController(grid);
        const wind_controller: WindController = new WindController(wind);
        // Distance of each axis
        const x_dist: number = wind.position.column - origin.column;
        const y_dist: number = wind.position.row - origin.row;

        // Directions bounded to [-1, 0, 1]
        const x_dir: number = x_dist != 0 ? x_dist / Math.abs(x_dist) : x_dist;
        const y_dir: number = y_dist != 0 ? y_dist / Math.abs(y_dist) : y_dist;

        const jump_distance = wind_controller.getNumberOfStackedWinds();
        const landing_position: Position = {
            row: wind.position.row + jump_distance * y_dir,
            column: wind.position.column + jump_distance * x_dir,
        }

        if (grid_controller.isPositionValid(landing_position) == false) {
            return true;
        }

        if (grid_controller.isPositionEmpty(landing_position)) {
            return false;
        } else if (grid_controller.isWindCell(landing_position)) {

            return this.isWindBlocked(grid, origin, grid_controller.getGridCellByPosition(landing_position) as WindModel);
        }
        return true

    }

    /** Performs all checkers for the sage movement */
    public static isSageMoveValid(grid: IGridModel, current_position: Position, new_position: Position): boolean {

        const grid_controller: GridController = new GridController(grid);
        // check if there has been a movement
        if (PositionUtils.isSamePosition(current_position, new_position)) {
            // Hadn't moved so it's not considered a movement
            return false;
        }
        // Check if the new position is valid
        if (grid_controller.isPositionValid(new_position) == false) {
            return false;
        }

        // Check if the movement is to an empty cell
        if (grid_controller.isPositionEmpty(new_position) == false) {
            // illegal move
            return false;
        }

        // Check if the move has been strict
        if (PositionUtils.isStrictPosition(current_position, new_position)) {
            // Check if it's trying to cross a range
            if (this.isCrossingRange(grid, current_position, new_position)) {
                return false;
            }
        } else {
            // Check if it's a legal wind/whirlwind move
            if (this.isWindJumpLegal(grid, current_position, new_position) == false) {
                // illegal move
                return false;
            }
        }
        return true;
    }

    /** Check whether there is a wind or a whirlwind in the sage move direction and it's legal
     * return: true if wind or whirlwind and jump is legal, otherwise false
     */
    private static isWindJumpLegal(grid: IGridModel, current_position: Position, new_position: Position): boolean {
        const grid_controller: GridController = new GridController(grid);
        // Distance of each axis
        const x_dist: number = new_position.column - current_position.column;
        const y_dist: number = new_position.row - current_position.row;

        // Directions bounded to [-1, 0, 1]
        const x_dir: number = x_dist != 0 ? x_dist / Math.abs(x_dist) : x_dist;
        const y_dir: number = y_dist != 0 ? y_dist / Math.abs(y_dist) : y_dist;

        let old_piece_position: Position;
        // Set position of the first cell in the sage move direction
        let next_piece_pos: Position = {
            row: current_position.row + y_dir,
            column: current_position.column + x_dir
        };

        while (PositionUtils.isSamePosition(next_piece_pos, new_position) == false) {
            // Check if current cell is wind
            if (grid_controller.isWindCell(next_piece_pos) == false) {
                // if it's not a wind piece, then the movement it's not allowed
                return false;
            }

            // Check there are no ranges between sage and wind
            if (this.isCrossingRange(grid, current_position, next_piece_pos)) {
                return false;
            }

            const wind_controller: WindController = new WindController(grid_controller.getGridCellByPosition(next_piece_pos) as WindModel);
            // Get cell piece
            const jump_distance: number = wind_controller.getNumberOfStackedWinds();

            for (let cell: number = 1; cell <= jump_distance; cell++) {
                // Get cell piece
                old_piece_position = next_piece_pos;
                next_piece_pos = {
                    row: next_piece_pos.row + 1 * y_dir,
                    column: next_piece_pos.column + 1 * x_dir
                }

                // Check if it's not a mountain 
                // NOTE:    It's not necessary since all Mountains are ranges, so 
                //          it's left like this in case other functionalities are added for mountains
                if (grid_controller.isMountainCell(next_piece_pos)) {
                    return false;
                }

                // Check there are no ranges in the middle of the jump
                if (grid_controller.isRangeCell(next_piece_pos)) {
                    return false;
                }

                // Check it's not crossing a range
                if (this.isCrossingRange(grid, old_piece_position, next_piece_pos)) {
                    return false;
                }
            }
        }

        return true;
    }

    private static isCrossingRange(grid: IGridModel, current_position: Position, new_position: Position): boolean {
        const grid_controller: GridController = new GridController(grid);

        const surrounding_y: Position = {
            row: current_position.row,
            column: new_position.column
        }

        const surrounding_x: Position = {
            row: new_position.row,
            column: current_position.column
        }

        if (grid_controller.isRangeCell(surrounding_x) && grid_controller.isRangeCell(surrounding_y)) {
            return true;
        }

        return false;

    }
}