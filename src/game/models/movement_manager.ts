
import { Earth } from "./elements/earth";
import { Wind } from "./elements/wind";
import { Grid, Position } from "./grid";
import { Empty, Piece } from "./pieces";


/** Performs all checkers for the sage movement */
export function isSageMoveValid(grid: Grid, current_position: Position, new_position: Position): boolean {
    
    // check if there has been a movement
    if(hasMoved(current_position, new_position) == false){
        // Hadn't moved so it's not considered a movement
        return false;
    }
    // Check if the new position is valid
    if (isPositionValid(grid, new_position) == false){
        return false;
    }

    // Check if the movement is to an empty cell
    if(isPositionEmpty(grid, new_position) == false){
        // illegal move
        return false;
    }

    // Check if the move has been strict
    if(isStrictMove(current_position, new_position) == false){
        // Check if it's a legal wind/whirlwind move
        if(isWindJumpLegal(grid, current_position, new_position) == false){
            // illegal move
            return false;
        }
    }    
    return true;
}

/** Check whether there is movement so current and new positions are different
 * return: true if there is movement, false otherwise
 */
function hasMoved(current_position: Position, new_position: Position): boolean {
    return !((current_position.row == new_position.row) && (current_position.column == new_position.column));
}

/** Check whether the position is inside the grid boundaries */
function isPositionValid(grid: Grid, new_position: Position){
    return (grid.getWidth() > new_position.column) && (grid.getHeight() > new_position.row);
}

/** Check whether the move is strict or not. Strict means moves of only a single cell
 * return: true if is strict, false otherwise
 */
function isStrictMove(current_position: Position, new_position: Position): boolean {
    const distance_x: number = Math.abs(current_position.column - new_position.column);
    const distance_y: number = Math.abs(current_position.row - new_position.row);

    if((distance_x > 1) || (distance_y > 1)){
        return false;
    }
    return true;
}

/** Check whether the move is orthogonal
 * return: true if orthogonal, false otherwise
 */
function isOrthogonalMove(current_position: Position, new_position: Position): boolean {

    if(( current_position.row != new_position.row ) && (current_position.column == new_position.column)){
        /** Horizontally Orthogonal */
        return true;
    }
    
    if((current_position.column != new_position.column) && (current_position.row == new_position.row)){
        /** Vertically Orthogonal */
        return true;
    }
    return false;
}

/** Check whether the move is diagonal
 * return: true if diagonal, false otherwise
 */
function isDiagonalMove(current_position: Position, new_position: Position): boolean {
    if((Math.abs(current_position.row - new_position.row) == 1) && (Math.abs(current_position.column - new_position.column) == 1)){
        /** Diagonal move */
        return true;
    }
    return false;
}

/** Check whether the position is empty
 * return: true if empty, false otherwise
 */
function isPositionEmpty(grid: Grid, new_position: Position): boolean {
    return grid.getGridCellByPosition(new_position) instanceof Empty;
}

/** Check whether the position is wind
 * return: true if empty, false otherwise
 */
 function isWindCell(grid: Grid, position: Position): boolean {
    return grid.getGridCellByPosition(position) instanceof Wind;
}

/** Check whether the position is a mountain
 * return true if mountain, false otherwise
 */
function isMountain(grid: Grid, position: Position): boolean {
    const piece: Piece = grid.getGridCellByPosition(position);
    if ( piece instanceof Earth){
        return (piece as Earth).isMountain();
    }
    return false;
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
        if(isWindCell(grid, next_piece_pos) == false){
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
            if(isMountain(grid, next_piece_pos)){
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