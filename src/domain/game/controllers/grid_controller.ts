import { IGridModel } from "../models/grid";
import { IPieceModel } from '../models/pieces/pieces';
import { EmptyModel } from '../models/pieces/empty';
import { EmptyPieceCreator } from '../models/pieces_factory';
import { PositionUtils, Position } from '../utils/position_utils';
import { EmptyController } from "./pieces/empty_controller";
import { FireModel } from "../models/elements/fire";
import { EarthModel } from "../models/elements/earth";
import { WaterModel } from "../models/elements/water";
import { WindModel } from "../models/elements/wind";
import { WindController } from "./elements/wind_controller";
import { EarthController } from "./elements/earth_controller";

export interface IGridController {
    getWidth(): number
    getHeight(): number
    updateGridCell(piece: IPieceModel): void
    getGridCellByPosition(position: Position): IPieceModel
    displayGrid(): void
    generateInitialGrid(width: number, height: number): void;
    clearCell(cell: Position): void
    isPositionValid(new_position: Position): boolean
    isPositionEmpty(new_position: Position): boolean
    isFireCell(position: Position): boolean
    isEarthCell(position: Position): boolean
    isWaterCell(position: Position): boolean
    isWindCell(position: Position): boolean
    isWhirlwindCell(position: Position): boolean
    isMountainCell(position: Position): boolean
    isRangeCell(position: Position): boolean
    getSurroundingPieces(position: Position): Array<IPieceModel>
}

export class GridController implements IGridController {

    private model: IGridModel;

    constructor(model: IGridModel) {
        this.model = model;
    }

    public getWidth(): number {
        return this.model.width
    }

    public getHeight(): number {
        return this.model.height
    }

    public updateGridCell(piece: IPieceModel): void {
        this.model.cells[piece.position.row][piece.position.column] = piece;
    }

    public getGridCellByPosition(position: Position): IPieceModel {
        return this.model.cells[position.row][position.column];
    }

    public displayGrid(): void {
        for (const row of this.model.cells) {
            for (const column of row) {
                console.log(column);
            }
        }
    }

    public generateInitialGrid(width: number, height: number): void {
        this.model.width = width;
        this.model.height = height;
        
        this.model.cells = new Array(height);
        for (let row = 0; row < height; row++) {
            this.model.cells[row] = new Array(width);
            for (let col = 0; col < width; col++) {
                const new_position: Position = { row: row, column: col };

                this.model.cells[row][col] = new EmptyPieceCreator().createPieceModel() as EmptyModel;
                new EmptyController(this.model.cells[row][col]).updatePosition(new_position);
            }
        }
    }

    /** Clears the cell by placing an empty piece */
    public clearCell(cell: Position): void {
        if (this.isPositionValid(cell)) {
            const piece: EmptyModel = new EmptyModel();
            new EmptyController(piece).updatePosition(cell);
            this.updateGridCell(piece);
        }
    }

    /** Check whether the position is inside the grid boundaries */
    public isPositionValid(new_position: Position): boolean {
        return (this.getWidth() > new_position.column) &&
            (0 <= new_position.column) &&
            (0 <= new_position.row) &&
            (this.getHeight() > new_position.row);
    }

    /** Check whether the position is empty
     * return: true if empty, false otherwise
     */
    public isPositionEmpty(new_position: Position): boolean {
        return this.getGridCellByPosition(new_position) instanceof EmptyModel;
    }


    /** Check whether the position is fire
     * return: true if empty, false otherwise
     */
    public isFireCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof FireModel;
    }

    /** Check whether the position is earth
     * return: true if empty, false otherwise
     */
    public isEarthCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof EarthModel;
    }

    /** Check whether the position is water
     * return: true if empty, false otherwise
     */
    public isWaterCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof WaterModel;
    }


    /** Check whether the position is wind
     * return: true if empty, false otherwise
     */
    public isWindCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof WindModel;
    }

    /** Check whether the position is whirlwind
     * return: true if empty, false otherwise
     */
    public isWhirlwindCell(position: Position): boolean {
        const piece: IPieceModel = this.getGridCellByPosition(position);
        if (piece instanceof WindModel) {
            const wind_controller: WindController = new WindController(piece);
            return wind_controller.getNumberOfStackedWinds() > 1;
        }
        return false;
    }

    /** Check whether the position is a mountain
     * return true if mountain, false otherwise
     */
    public isMountainCell(position: Position): boolean {
        const piece: IPieceModel = this.getGridCellByPosition(position);
        if (piece instanceof EarthModel) {
            const earth_controller: EarthController = new EarthController(piece);
            return earth_controller.isMountain();
        }
        return false;
    }

    /** Check whether the position is a range
     * return true if mountain, false otherwise
     */
    public isRangeCell(position: Position): boolean {
        const piece: IPieceModel = this.getGridCellByPosition(position);
        if (piece instanceof EarthModel) {
            const earth_controller: EarthController = new EarthController(piece);
            return earth_controller.isRange();
        }
        return false;
    }

    /** Get surrounding pieces of the provided position 
     * return IPieceModel list
    */
    public getSurroundingPieces(position: Position): Array<IPieceModel> {
        const piece_list: Array<IPieceModel> = []
        for (const axis_inc of PositionUtils.all_direction_increment_map.values()) {
            const piece_pos: Position = {
                row: position.row + axis_inc.y,
                column: position.column + axis_inc.x,
            }
            piece_list.push(this.getGridCellByPosition(piece_pos));
        }
        return piece_list;
    }
}

export default GridController;