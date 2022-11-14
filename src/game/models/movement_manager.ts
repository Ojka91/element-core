
import { Grid, Position } from "./grid";
import { Empty } from "./pieces";


/** Performs all checkers for the sage movement */
export function isSageMoveValid(grid: Grid, current_position: Position, new_position: Position): boolean {
    if(hasMoved(current_position, new_position) == false){
        // Hadn't moved so it's not considered a movement
        return false;
    }
    if (isOrthogonalMove(current_position, new_position) || (isDiagonalMove(current_position, new_position))){
        // Legal move
        if(isPositionEmpty(grid, new_position)){
            // Allowed move
            return true;
        }
    }
    return false;
}

function hasMoved(current_position: Position, new_position: Position): boolean {
    return !((current_position.row == new_position.row) && (current_position.column == new_position.column));
}

function isOrthogonalMove(current_position: Position, new_position: Position): boolean {
    if((Math.abs(current_position.row - new_position.row) <= 1) && (current_position.column == new_position.column)){
        /** Horizontally Orthogonal */
        return true;
    }
    
    if((Math.abs(current_position.column - new_position.column) <= 1) && (current_position.row == new_position.row)){
        /** Vertically Orthogonal */
        return true;
    }
    return false;
}

function isDiagonalMove(current_position: Position, new_position: Position): boolean {
    if((Math.abs(current_position.row - new_position.row) == 1) && (Math.abs(current_position.column - new_position.column) == 1)){
        /** Diagonal move */
        return true;
    }
    return false;
}

function isPositionEmpty(grid: Grid, new_position: Position): boolean {
    return grid.getGridCellByPosition(new_position) instanceof Empty;
}
