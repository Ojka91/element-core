import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { Element } from "./elements";
import { Wind } from "./wind";

enum PropagationDirection {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

const propagation_map = {
    "Up": {
        inc_x: 0,
        inc_y: 1
    },
    "Down": {
        inc_x: 0,
        inc_y: -1
    },
    "Left": {
        inc_x: -1,
        inc_y: 0
    },
    "Right": {
        inc_x: 1,
        inc_y: 0
    }
}

/**
 * Fire class
 * @brief   Once placed next to other fire element it reacts adding one extra Fire in the opposite side of the already placed fire.
 *          If a Water, Earth/Mountain or Sage occupies the opposite space, NO extra Fire is added. If it is Wind/Whirlwind element then Wind is replaced by Fire.
 *          Extra Fire elements can only be placed orthogonally, NEVER diagonally.
 *          Extra Fire elements do not generate extra Fire elements.
 */
 export class Fire extends Element{

    constructor(){
        super();
    }

    ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Wind){
            return true;
        }
        return false;
    }

    reaction(grid: Grid, cell: Position): void {

        this.propagate(grid, cell, PropagationDirection.Up);
        this.propagate(grid, cell, PropagationDirection.Down);
        this.propagate(grid, cell, PropagationDirection.Left);
        this.propagate(grid, cell, PropagationDirection.Right);
    }

    /** Propagation shall be done by looking for Orthogonal lines of fire and adding one extra fire in the opposite side of the placed cell */
    private propagate(grid: Grid, cell: Position, direction: PropagationDirection): void {
        
        const evaluation_cell: Position = {
            row: cell.row + propagation_map[direction].inc_y,
            column: cell.column + propagation_map[direction].inc_x
        }
        if(grid.isPositionValid(evaluation_cell)){
            if (grid.isFireCell(evaluation_cell)){
                this.propagate(grid, evaluation_cell, direction);
            } else {
                const free_fire = new Fire();
                free_fire.updatePosition(evaluation_cell);
                
                if(grid.isPositionEmpty(evaluation_cell)){
                    grid.updateGridCell(free_fire);
                } else if(grid.isWindCell(evaluation_cell) && !(grid.isWhirlwindCell(evaluation_cell))){
                    grid.updateGridCell(free_fire);
                }
            }
        }
    }
}
