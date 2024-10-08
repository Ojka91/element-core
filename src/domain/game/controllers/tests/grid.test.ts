import { EarthModel } from "@/domain/game/models/elements/earth";
import { FireModel } from "@/domain/game/models/elements/fire";
import { WaterModel } from "@/domain/game/models/elements/water";
import { WindModel } from "@/domain/game/models/elements/wind";
import { GridModel } from "@/domain/game/models/grid";
import { SageModel } from "@/domain/game/models/pieces/sage";
import { SagePieceCreator } from "@/domain/game/models/pieces_factory";
import { Position } from "@/domain/game/utils/position_utils";
import { EarthController } from "../elements/earth_controller";
import { FireController } from "../elements/fire_controller";
import { WaterController } from "../elements/water_controller";
import { WindController } from "../elements/wind_controller";
import GridController from "../grid_controller";
import { SageController } from "../pieces/sage_controller";

describe('Grid', () => {
    it('getWidth: ensure the grid width return the creation width', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        expect(grid_controller.getWidth() == 10).toBe(true);
    })

    it('getHeight: ensure the grid width return the creation height', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        expect(grid_controller.getHeight() == 8).toBe(true);
    })


    it('updateGridCell: cells must updated with new item', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const sage: SageModel = new SagePieceCreator().createPieceModel() as SageModel;
        const position: Position = { row: 2, column: 2 };
        new SageController(sage).updatePosition(position);
        grid_controller.updateGridCell(sage);

        expect(grid_controller.getGridCellByPosition(position)).toStrictEqual(sage);
    })

    it('clearCell: cells must cleared to empty', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const sage: SageModel = new SagePieceCreator().createPieceModel() as SageModel;
        const position: Position = { row: 2, column: 2 };
        new SageController(sage).updatePosition(position);
        grid_controller.updateGridCell(sage);

        expect(grid_controller.getGridCellByPosition(position)).toStrictEqual(sage);

        grid_controller.clearCell(position);
        expect(grid_controller.isPositionEmpty(position)).toBe(true);

    })

    it('isPositionValid: must return true is position between grid boundaries, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const position: Position = { row: 2, column: 2 };
        const incorrect_position: Position = { row: 11, column: 11 };

        expect(grid_controller.isPositionValid(position)).toBe(true);

        expect(grid_controller.isPositionValid(incorrect_position)).toBe(false);

    })

    it('isPositionEmpty: must return true if position is empty, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const sage: SageModel = new SagePieceCreator().createPieceModel() as SageModel;
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isPositionEmpty(position)).toBe(true);

        new SageController(sage).updatePosition(position);
        grid_controller.updateGridCell(sage);

        expect(grid_controller.isPositionEmpty(position)).toBe(false);

    })

    it('isFireCell: must return true if position is fire, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: FireModel = new FireModel();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isFireCell(position)).toBe(false);

        new FireController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isFireCell(position)).toBe(true);

    })

    it('isEarthCell: must return true if position is earth, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: EarthModel = new EarthModel();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isEarthCell(position)).toBe(false);

        new EarthController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isEarthCell(position)).toBe(true);

    })

    it('isWaterCell: must return true if position is Water, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: WaterModel = new WaterModel();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isWaterCell(position)).toBe(false);

        new WaterController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isWaterCell(position)).toBe(true);

    })

    it('isWindCell: must return true if position is Wind, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: WindModel = new WindModel();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isWindCell(position)).toBe(false);

        new WindController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isWindCell(position)).toBe(true);

    })

    it('isWhirlwindCell: must return true if position is Whirlwind, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: WindModel = new WindModel();
        new WindController(piece).increaseStackedWinds();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isWhirlwindCell(position)).toBe(false);

        new WindController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isWhirlwindCell(position)).toBe(true);

    })

    it('isMountainCell: must return true if position is Mountain, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: EarthModel = new EarthModel();
        new EarthController(piece).promoteToMountain();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isMountainCell(position)).toBe(false);

        new EarthController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isMountainCell(position)).toBe(true);

    })

    it('isRangeCell: must return true if position is Range, false othwerwise', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);


        const piece: EarthModel = new EarthModel();
        new EarthController(piece).promoteToRange();
        const position: Position = { row: 0, column: 0 };

        // Upon creation grid is empty
        expect(grid_controller.isRangeCell(position)).toBe(false);

        new EarthController(piece).updatePosition(position);
        grid_controller.updateGridCell(piece);

        expect(grid_controller.isRangeCell(position)).toBe(true);

    })
})