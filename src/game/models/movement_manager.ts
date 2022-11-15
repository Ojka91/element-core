
import { Earth } from "./elements/earth";
import { Wind } from "./elements/wind";
import { Grid, Position } from "./grid";
import { Piece } from "./pieces";
import { isSamePosition, isStrictPosition } from "./position_utils"

/** Performs all checkers for the sage movement */
export function isSageMoveValid(grid: Grid, current_position: Position, new_position: Position): boolean {
    
    // check if there has been a movement
    if(isSamePosition(current_position, new_position)){
        // Hadn't moved so it's not considered a movement
        return false;
    }
    // Check if the new position is valid
    if (grid.isPositionValid(new_position) == false){
        return false;
    }

    // Check if the movement is to an empty cell
    if(grid.isPositionEmpty(new_position) == false){
        // illegal move
        return false;
    }

    // Check if the move has been strict
    if(isStrictPosition(current_position, new_position) == false){
        // Check if it's a legal wind/whirlwind move
        if(isWindJumpLegal(grid, current_position, new_position) == false){
            // illegal move
            return false;
        }
    }    
    return true;
}

/** Check whether there is a range between the current position and the new position 
 * return: true if blocked, false otherwise
*/
function isBlockedByRange(grid: Grid, current_position: Position, new_position: Position): boolean {
    const vertical_pos: Position = {row: new_position.row, column: current_position.column};
    const horizontal_pos: Position = {row: current_position.row, column: new_position.column};

    const piece_vertical: Piece = grid.getGridCellByPosition(vertical_pos);
    const piece_horizontal: Piece = grid.getGridCellByPosition(horizontal_pos);

    /* The direction is not surrounded by earth's then sage is not blocked */
    if(((piece_vertical instanceof Earth) && (piece_horizontal instanceof Earth)) == false){
        return false;
    }

    /* Getting here means sage move surrounded by earth's */
    const earth: Earth = piece_vertical as Earth;
    return earth.isRange();
}

/** Check whether there is a wind or a whirlwind in the sage move direction and it's legal
 * return: true if wind or whirlwind and jump is legal, otherwise false
 */
function isWindJumpLegal(grid: Grid, current_position: Position, new_position: Position): boolean {
    // Distance of each axis
    const x_dist: number = new_position.column - current_position.column;
    const y_dist: number = new_position.row - current_position.row;

    // Directions bounded to [-1, 0, 1]
    const x_dir: number = x_dist != 0 ? x_dist / Math.abs(x_dist) : x_dist;
    const y_dir: number = y_dist != 0 ? y_dist / Math.abs(y_dist) : y_dist;

    let old_piece_position: Position;
    // Set position of the first cell in the sage move direction
    let next_piece_pos: Position  = {
        row: current_position.row + y_dir,
        column: current_position.column + x_dir
    };
    
    while (!((next_piece_pos.row == new_position.row) && (next_piece_pos.column == new_position.column))){
        // Check if current cell is wind
        if(grid.isWindCell(next_piece_pos) == false){
            // if it's not a wind piece, then the movement it's not allowed
            return false;
        }

        // Get cell piece
        const jump_distance: number = (grid.getGridCellByPosition(next_piece_pos) as Wind).getNumberOfStackedWinds();

        for (let cell: number = 1; cell <= jump_distance; cell++){
            // Get cell piece
            old_piece_position = next_piece_pos;
            next_piece_pos = {
                row:    next_piece_pos.row + 1 * y_dir,
                column: next_piece_pos.column + 1 * x_dir
            }

            // Check if it's not a mountain
            if(grid.isMountainCell(next_piece_pos)){
                return false;
            }

            // Check there are no ranges in the middle of the jump
            if(isBlockedByRange(grid, next_piece_pos, old_piece_position)){
                return false;
            }
        }
    }
    if (!((next_piece_pos.row == new_position.row)&&(next_piece_pos.column == new_position.column))){
        return false;
    }
    
    return true;
}