import { ElementController, IElementController } from "./elements_controller";
import { FireModel, IFireModel } from "@/game/models/elements/fire";
import { IPieceModel } from "@/game/models/pieces/pieces";
import { AxisIncrement, Position, PositionUtils } from "@/game/utils/position_utils";
import { WindModel } from "@/game/models/elements/wind";
import { IGridModel } from "@/game/models/grid";
import GridController from "../grid_controller";
import { ElementTypes } from "@/game/models/elements/elements";
import { WindController } from "./wind_controller";
import { ElementPoolManagerModel } from "@/game/models/element_pool";
import ElementPoolManager from "../element_pool_controller";

const propagation_map: Map<string, AxisIncrement> = PositionUtils.orthogonal_increment_map;

/**
 * Fire class
 * @brief   Once placed next to other fire element it reacts adding one extra Fire in the opposite side of the already placed fire.
 *          If a Water, Earth/Mountain or Sage occupies the opposite space, NO extra Fire is added. If it is Wind/Whirlwind element then Wind is replaced by Fire.
 *          Extra Fire elements can only be placed orthogonally, NEVER diagonally.
 *          Extra Fire elements do not generate extra Fire elements.
 */
export interface IFireController extends IElementController {
    ruleOfReplacement(piece_to_replace: IPieceModel): boolean;
    reaction(grid: IGridModel, cell: Position, element_pool_manager?: ElementPoolManagerModel): void;
}

export class FireController extends ElementController implements IFireController {

    protected model: FireModel;

    constructor(model: IFireModel) {
        super(model);
        this.model = model
    }

    public ruleOfReplacement(piece_to_replace: IPieceModel): boolean {
        if (piece_to_replace instanceof WindModel) {
            if (new WindController(piece_to_replace).getNumberOfStackedWinds() == 1) {
                return true;
            }
        }
        return false;
    }

    public reaction(grid: IGridModel, cell: Position, element_pool_manager?: ElementPoolManagerModel): void {

        if (element_pool_manager === undefined) {
            throw new Error("Element pool is required for Fire reaction")
        }
        const grid_controller: GridController = new GridController(grid);

        propagation_map.forEach((value: AxisIncrement, key: string) => {
            const evaluation_cell: Position = {
                row: cell.row + value.y,
                column: cell.column + value.x
            }

            // Propagation only happens IF orthogonal positions contains another fire. So first we need to make sure surrounding positions are NOT empty
            // If we dont do this, fire will propagate over itself (with no surrounding fires)
            if (grid_controller.isPositionValid(evaluation_cell) && grid_controller.isFireCell(evaluation_cell)) {
                 this.propagate(grid, cell, value, element_pool_manager);
            }
        })
    }

    /** Propagation shall be done by looking for Orthogonal lines of fire and adding one extra fire in the opposite side of the placed cell */
    private propagate(grid: IGridModel, cell: Position, direction: AxisIncrement, element_pool_manager: ElementPoolManagerModel): void {

        const grid_controller: GridController = new GridController(grid);

        const evaluation_cell: Position = {
            row: cell.row + direction.y,
            column: cell.column + direction.x
        }
        if (grid_controller.isPositionValid(evaluation_cell)) {
            if (grid_controller.isFireCell(evaluation_cell)) {
                this.propagate(grid, evaluation_cell, direction, element_pool_manager);
            } else {
                const free_fire = new FireModel();
                new FireController(free_fire).updatePosition(evaluation_cell);

                try {
                    new ElementPoolManager(element_pool_manager).removeElement(ElementTypes.Fire);
                } catch {
                    /** Cannot propagate anymore since there are no fire elements to draw */
                    return;
                }

                if (grid_controller.isPositionEmpty(evaluation_cell)) {
                    grid_controller.updateGridCell(free_fire);
                } else if (this.ruleOfReplacement(grid_controller.getGridCellByPosition(evaluation_cell))) {
                    grid_controller.updateGridCell(free_fire);
                }
            }
        }
    }
}
