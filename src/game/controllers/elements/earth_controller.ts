import { PositionUtils, AxisIncrement, Position } from "@/game/utils/position_utils";
import { EarthModel, IEarthModel } from "@/game/models/elements/earth";
import GridController from "../grid_controller";
import { IPieceModel, PieceModel } from "@/game/models/pieces/pieces";
import { IGridModel } from "@/game/models/grid";
import { WaterModel } from "@/game/models/elements/water";
import { ElementController, IElementController } from "./elements_controller";
import ElementPoolManager from "../element_pool_controller";
import { ElementTypes } from "@/game/models/elements/elements";


const all_direction_map: Map<string, AxisIncrement> = PositionUtils.all_direction_increment_map;

/**
 * Earth class
 * @brief   Earth blocks the sage to move.
 *          Stacking two Earth's it becomes a Mountain. 
 *          Water elements can be replaced by Earth.
 *          Earth elements can be replaced by Wind unless they became a Mountain.
 *          Any Earth connected orthogonally or diagonally to a Mountain
 *          become a Range and share the same properties as a Mountain.
 *          A Range blocks the Sage to move diagonally.
 */
export interface IEarthController extends IElementController {
    place(grid: IGridModel, cell: Position, element_pool_manager: ElementPoolManager): boolean;
    isMountain(): boolean;
    isRange(): boolean;
    promoteToRange(): void;
    promoteToMountain(): void;
    ruleOfReplacement(piece_to_replace: IPieceModel, element_pool_manager: ElementPoolManager): boolean;
    reaction(grid: IGridModel, cell: Position): void;
}

export class EarthController extends ElementController implements IEarthController {
    protected model: EarthModel;

    constructor(model: IEarthModel) {
        super(model);
        this.model = model;
    }

    // Override parent method
    public place(grid: IGridModel, cell: Position, element_pool_manager: ElementPoolManager): boolean {
        const grid_controller: GridController = new GridController(grid);
        const piece: PieceModel = grid_controller.getGridCellByPosition(cell);
        this.model.position = cell;
        if (piece instanceof EarthModel) {
            if (new EarthController(piece).isMountain() == false) {
                this.promoteToMountain();
                grid_controller.updateGridCell(this.model)
                this.formRange(grid, cell);
                return true;
            } else {
                return false;
            }
        }
        if (grid_controller.isPositionEmpty(cell) || (this.ruleOfReplacement(piece, element_pool_manager))) {
            grid_controller.updateGridCell(this.model)

            return true;
        }
        return false;
    }

    public isMountain(): boolean {
        return this.model.is_mountain;
    }

    public isRange(): boolean {
        return this.model.is_range;
    }

    public promoteToRange(): void {
        this.model.is_range = true;
    }

    public promoteToMountain(): void {
        this.model.is_mountain = true;
        this.promoteToRange();
    }

    public ruleOfReplacement(piece_to_replace: IPieceModel, element_pool_manager: ElementPoolManager): boolean {
        if (piece_to_replace instanceof WaterModel) {
            element_pool_manager.addElement(ElementTypes.Water);
            return true;
        }
        if (piece_to_replace instanceof EarthModel) {
            if (this.model.is_mountain == false) {
                return true;
            }
        }
        return false;
    }

    public reaction(grid: IGridModel, cell: Position): void {

    }

    private formRange(grid: IGridModel, cell: Position) {

        const grid_controller: GridController = new GridController(grid);

        // In this array are stored all the surrounding Earths of the evaluated earth position
        let surrounding_earths: Array<Position> = this.getSurroundingEarths(grid, cell);

        // Until there are surrounding earths to evaluate
        while (surrounding_earths.length != 0) {
            let next_surrounding_earths: Array<Position> = [];
            surrounding_earths.forEach((earth_pos: Position) => {
                const earth: EarthModel = grid_controller.getGridCellByPosition(earth_pos) as EarthModel;
                new EarthController(earth).promoteToRange();

                next_surrounding_earths = next_surrounding_earths.concat(new EarthController(earth).getSurroundingEarths(grid, earth_pos));

            });
            surrounding_earths = next_surrounding_earths;
        }

    }

    private getSurroundingEarths(grid: IGridModel, cell: Position): Array<Position> {
        let surrounding_earths: Array<Position> = [];
        let evaluation_cell: Position;

        const grid_controller: GridController = new GridController(grid);

        all_direction_map.forEach((value: AxisIncrement, key: string) => {
            evaluation_cell = {
                row: cell.row + value.y,
                column: cell.column + value.x
            };
            if (grid_controller.isPositionValid(evaluation_cell) && grid_controller.isEarthCell(evaluation_cell) && (grid_controller.isRangeCell(evaluation_cell) == false)) {
                surrounding_earths.push(evaluation_cell);
            }
        })

        return surrounding_earths;
    }
}
