import ElementPoolManager from "../element_pool_manager";
import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { AxisIncrement, PositionUtils } from "../position_utils";
import { Element, ElementTypes } from "./elements";
import { Wind } from "./wind";

const propagation_map: Map<string, AxisIncrement> = PositionUtils.orthogonal_increment_map;

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
            if(piece_to_replace.getNumberOfStackedWinds() == 1){
                return true;
            }
        }
        return false;
    }

    reaction(grid: Grid, cell: Position, element_pool_manager?: ElementPoolManager): void {

        if(element_pool_manager === undefined){
            throw new Error("Element pool is required for Fire reaction")
        }
        propagation_map.forEach((value: AxisIncrement, key: string) => {
            this.propagate(grid, cell, value, element_pool_manager);
        })
    }

    /** Propagation shall be done by looking for Orthogonal lines of fire and adding one extra fire in the opposite side of the placed cell */
    private propagate(grid: Grid, cell: Position, direction: AxisIncrement, element_pool_manager: ElementPoolManager): void {
        
        const evaluation_cell: Position = {
            row: cell.row + direction.y,
            column: cell.column + direction.x
        }
        if(grid.isPositionValid(evaluation_cell)){
            if (grid.isFireCell(evaluation_cell)){
                this.propagate(grid, evaluation_cell, direction, element_pool_manager);
            } else {
                const free_fire = new Fire();
                free_fire.updatePosition(evaluation_cell);
                
                try {
                    element_pool_manager.removeElement(ElementTypes.Fire);
                } catch {
                    /** Cannot propagate anymore since there are no fire elements to draw */
                    return;
                }
                
                if(grid.isPositionEmpty(evaluation_cell)){
                    grid.updateGridCell(free_fire);
                } else if(this.ruleOfReplacement(grid.getGridCellByPosition(evaluation_cell))){
                    grid.updateGridCell(free_fire);
                }
            }
        }
    }
}
