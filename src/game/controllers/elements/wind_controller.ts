import { EarthModel } from "@/game/models/elements/earth";
import { IWindModel, WindModel } from "@/game/models/elements/wind";
import { IGridModel } from "@/game/models/grid";
import { IPieceModel, PieceModel } from "@/game/models/pieces/pieces";
import { Position } from "@/game/utils/position_utils";
import GridController from "../grid_controller";
import { EarthController } from "./earth_controller";
import { ElementController } from "./elements_controller";

const MAX_STACKED_WINDS: number = 4;

/**
 * Wind class
 * @brief   Wind allows the sage to jump through the piece.
 *          Jumping thorugh Wind can be performed both diagonally and orthogonally
 *          Wind can replace Earth elements but NEVER replace Mountains.
 *          Stacking two Wind elements in the same piece will upgrade the element to Whirlwind
 */
 export class WindController extends ElementController{
    protected model: WindModel;

    constructor(model: IWindModel){
        super(model);
        this.model = model;
    }

    // Override parent method
    public place(grid: IGridModel, cell: Position): boolean {
        const grid_controller: GridController = new GridController(grid);
        const piece: PieceModel = grid_controller.getGridCellByPosition(cell);
        this.model.position = cell;
        if(piece instanceof WindModel){
            const wind_controller: WindController = new WindController(piece);
            if(wind_controller.isMaxWhirlwind() == false){
                this.model.stacked_winds = wind_controller.getNumberOfStackedWinds() + 1;
                grid_controller.updateGridCell(this.model);
                return true;
            } else {
                return false;
            }
        }
        if(grid_controller.isPositionEmpty(cell) || (this.ruleOfReplacement(piece))){
            grid_controller.updateGridCell(this.model);
            return true;
        }
        return false;
    }

    public isMaxWhirlwind(): boolean {
        return this.model.stacked_winds == MAX_STACKED_WINDS;
    }

    public increaseStackedWinds(): void {
        if(this.model.stacked_winds < MAX_STACKED_WINDS){
            this.model.stacked_winds++;
        }
    }

    public getNumberOfStackedWinds(): number {
        return this.model.stacked_winds;
    }

    public ruleOfReplacement(piece_to_replace: IPieceModel): boolean {
        
        if(piece_to_replace instanceof EarthModel){
            const eart_controller: EarthController = new EarthController(piece_to_replace as EarthModel);
            if(eart_controller.isMountain() || eart_controller.isRange()){
                return false;
            }
            return true;
        } else if (piece_to_replace instanceof WindModel){
            return !new WindController(this.model).isMaxWhirlwind()
        }
        return false;
    }

    public reaction(grid: IGridModel, cell: Position): void {
        
        return;
    }
}
