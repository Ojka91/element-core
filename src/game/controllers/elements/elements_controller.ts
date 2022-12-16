import { PieceController } from '../pieces/piece_controller';
import { IGridModel } from "../../models/grid";
import { PieceModel } from "../../models/pieces/pieces";
import { Position } from '../../utils/position_utils'
import GridController from '../grid_controller';
import { IElementModel } from '@/game/models/elements/elements';
import ElementPoolManager from '../element_pool_controller';

export interface IElementController {

    ruleOfReplacement(piece_to_replace: PieceModel, element_pool_manager: ElementPoolManager): boolean;
    reaction(grid: IGridModel, cell: Position): void;
    place(grid: IGridModel, cell: Position, element_pool_manager: ElementPoolManager): boolean;
}

/** Abstract class for all elements */
export abstract class ElementController extends PieceController implements IElementController{

    /** All Elements has their own rule of replacement, this function return if it's allowed to be replace the piece with the element */
    public abstract ruleOfReplacement(piece_to_replace: PieceModel, element_pool_manager: ElementPoolManager): boolean

    /** Reaction of placing the element into the board */
    public abstract reaction(grid: IGridModel, cell: Position): void

    /** Function to place the element into a grid */
    public place(grid: IGridModel, cell: Position, element_pool_manager: ElementPoolManager): boolean {
        const grid_controller: GridController = new GridController(grid);
        const piece: PieceModel = grid_controller.getGridCellByPosition(cell);
        if (grid_controller.isPositionEmpty(cell) || (this.ruleOfReplacement(piece, element_pool_manager))) {
            this.model.position = cell;
            grid_controller.updateGridCell(this.model)
            return true;
        }

        return false;
    }
}
