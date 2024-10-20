import { EarthModel } from "@/domain/game/models/elements/earth";
import { ElementTypes } from "@/domain/game/models/elements/elements";
import { WindModel } from "@/domain/game/models/elements/wind";
import { GridModel } from "@/domain/game/models/grid";
import { MovementManager } from "@/domain/game/controllers/movement_manager";
import { SageModel } from "@/domain/game/models/pieces/sage";
import { ElementPieceCreator, SagePieceCreator } from "@/domain/game/models/pieces_factory";
import { Position } from "@/domain/game/utils/position_utils";
import { EarthController } from "../elements/earth_controller";
import { WindController } from "../elements/wind_controller";
import GridController from "../grid_controller";
import { SageController } from "../pieces/sage_controller";
import { ElementPoolManagerModel } from "@/domain/game/models/element_pool";
import ElementPoolManager from "../element_pool_controller";
import { FireModel } from "@/domain/game/models/elements/fire";
import { FireController } from "../elements/fire_controller";

const surroundingSageMoves: Position[] = [
    // Orthogonal moves
    { row: 3, column: 5 }, // up
    { row: 5, column: 5 }, // down
    { row: 4, column: 4 }, // Right
    { row: 4, column: 6 }, // Down
    // Diagonal moves
    { row: 3, column: 4 }, // up-left
    { row: 3, column: 6 }, // up-right
    { row: 5, column: 5 }, // down-left
    { row: 5, column: 6 }, // down-right
]

describe('movement_manager', () => {
    it('MovementManager.isSageMoveValid: should return false if there is no change in position ', async () => {
        const cur_pos: Position = { row: 0, column: 0 };
        const new_pos: Position = { row: 0, column: 0 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return true for all allowed movements ', async () => {
    // Given initial Sage position for 2 players which is {row: 4, column: 5}
        const cur_pos: Position = { row: 4, column: 5 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        let result;
        for (const new_pos of surroundingSageMoves) {
            result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
            expect(result).toBe(true);
        }
    })

    it('MovementManager.isSageMoveValid: should return false for all illegal movements ', async () => {

        const cur_pos: Position = { row: 4, column: 5 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        let result;
        for (const new_pos of surroundingSageMoves) {
            const earth = new ElementPieceCreator(ElementTypes.Earth).createPieceModel() as EarthModel;
            new EarthController(earth).updatePosition(new_pos);
            grid_controller.updateGridCell(earth);
            result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
            expect(result).toBe(false);
        }

    })

    it('MovementManager.isSageMoveValid: should return false if the cell is not empty', async () => {
        const cur_pos: Position = { row: 4, column: 5 };
        const new_pos: Position = { row: 5, column: 6 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const sage = new SagePieceCreator().createPieceModel() as SageModel;
        new SageController(sage).updatePosition(new_pos);

        grid_controller.updateGridCell(sage);

        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);

    })

    it('MovementManager.isSageMoveValid: should return true upon wind jump', async () => {

        /* single wind 
          S: Sage
          W: Wind
          NS: New Sage Position
           0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   | S |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   | W |   |   |   |   |   |   |   |
         -----------------------------------------
      3  |   |   |   | NS|   |   |   |   |   |   |
         -----------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      */
        const cur_pos: Position = { row: 1, column: 1 };
        const wind_pos: Position = { row: 2, column: 2 };
        const new_pos: Position = { row: 3, column: 3 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const wind: WindModel = new WindModel();

        new WindController(wind).updatePosition(wind_pos);
        grid_controller.updateGridCell(wind);
        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(true);
    })

    it('MovementManager.isSageMoveValid: should return false upon wind jump to a cell not in line with wind', async () => {

        /* single wind 
          S: Sage
          W: Wind
          NS: New Sage Position
           0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   | S |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   | W |   |   |   |   |   |   |   |
         -----------------------------------------
      3  |   |   | NS|   |   |   |   |   |   |   |
         -----------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      */
        const cur_pos: Position = { row: 1, column: 1 };
        const wind_pos: Position = { row: 2, column: 2 };
        const new_pos: Position = { row: 3, column: 2 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const wind: WindModel = new WindModel();

        new WindController(wind).updatePosition(wind_pos);
        grid_controller.updateGridCell(wind);
        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return false jumping over a whirlwind less distance than stacked and true when jumping the correct distance', async () => {
    /* single whirlwind (2 stacks)
          S: Sage
          WL: Whirlwind
          NS: New Sage Position
          X: Invalid move
           0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   | S |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   | WL|   |   |   |   |   |   |   |
         -----------------------------------------
      3  |   |   |   | X |   |   |   |   |   |   |
         -----------------------------------------
      4  |   |   |   |   | NS|   |   |   |   |   |
         -----------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      */

        const cur_pos: Position = { row: 1, column: 1 };
        const wind_pos: Position = { row: 2, column: 2 };
        const new_pos: Position = { row: 3, column: 3 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const wind: WindModel = new WindModel();
        new WindController(wind).updatePosition(wind_pos);
        // convert wind to whirlwind
        new WindController(wind).increaseStackedWinds();
        grid_controller.updateGridCell(wind);
        let result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);

        new_pos.row = 4;
        new_pos.column = 4;

        result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(true);
    })

    it('MovementManager.isSageMoveValid: should return true jumping through a line of winds', async () => {
    /* two winds in line
         S: Sage
         W: Wind
         NS: New Sage Position
         X: Invalid move
            0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   | S |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   | W |   |   |   |   |   |   |   |
         -----------------------------------------
      3  |   |   |   | W |   |   |   |   |   |   |
         -----------------------------------------
      4  |   |   |   |   | NS|   |   |   |   |   |
         -----------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      */
        const cur_pos: Position = { row: 1, column: 1 };
        const wind_1_pos: Position = { row: 2, column: 2 };
        const wind_2_pos: Position = { row: 3, column: 3 };
        const new_pos: Position = { row: 4, column: 4 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        let wind: WindModel = new WindModel();
        new WindController(wind).updatePosition(wind_1_pos);
        grid_controller.updateGridCell(wind);
        wind = new WindModel();
        new WindController(wind).updatePosition(wind_2_pos);
        grid_controller.updateGridCell(wind);

        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(true);
    })

    it('MovementManager.isSageMoveValid: should return false jumping outside boundaries', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         NS: New Sage Position
         X: Invalid move
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   |   |   |   |   | S | W | NS <-- wrong!
         ---------------------------------------------
      2  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 1, column: 9 };
        const wind_pos: Position = { row: 1, column: 10 };
        const new_pos: Position = { row: 1, column: 11 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);

        const wind: WindModel = new WindModel();

        new WindController(wind).updatePosition(wind_pos);
        grid_controller.updateGridCell(wind);

        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return true jumping over an element', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   | S | WL| E | NS|   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 2, column: 4 };
        const wind_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 2, column: 7 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);

        const wind: WindModel = new WindModel();
        new WindController(wind).increaseStackedWinds();

        const earth: EarthModel = new EarthModel();

        new EarthController(earth).updatePosition(earth_pos);
        grid_controller.updateGridCell(earth);
        new WindController(wind).updatePosition(wind_pos);
        grid_controller.updateGridCell(wind);

        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(true);
    })

    it('MovementManager.isSageMoveValid: should return false jumping over a mountain', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         M: Mountain
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   | S | WL| M | NS|   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 2, column: 4 };
        const wind_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 2, column: 7 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);

        const wind: WindModel = new WindModel();
        new WindController(wind).increaseStackedWinds();

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).promoteToMountain();


        new EarthController(earth).updatePosition(earth_pos);
        grid_controller.updateGridCell(earth);
        new WindController(wind).updatePosition(wind_pos);
        grid_controller.updateGridCell(wind);

        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return false jumping over a range', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         M: Mountain
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   | NS|   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | E |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | WL| M |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   | S |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 3, column: 5 };
        const wind_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 1, column: 5 };
        const mountain_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 0, column: 5 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        // Generate Whirlwind
        const wind: WindModel = new WindModel();
        new WindController(wind).increaseStackedWinds();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        const earth_mountain_1 = new EarthModel();
        new EarthController(earth_mountain_1).place(grid, mountain_pos, element_pool_manager);

        // No range -> Valid jump
        let result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(true);

        // Add second earth to convert the earth into Mountain and range the surrounding earths
        const earth_mountain_2 = new EarthModel();
        new EarthController(earth_mountain_2).place(grid, mountain_pos, element_pool_manager);

        expect(grid_controller.isRangeCell(earth_pos)).toBe(true);

        // Then jump shouldn't be allowed
        result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return false crossing through two ranges', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         M: Mountain
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | E | NS|   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | S | M |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 1, column: 5 };
        const mountain_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 1, column: 6 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        const earth_mountain_1 = new EarthModel();
        new EarthController(earth_mountain_1).place(grid, mountain_pos, element_pool_manager);

        // Add second earth to convert the earth into Mountain and range the surrounding earths
        const earth_mountain_2 = new EarthModel();
        new EarthController(earth_mountain_2).place(grid, mountain_pos, element_pool_manager);

        expect(grid_controller.isRangeCell(earth_pos)).toBe(true);
        expect(grid_controller.isRangeCell(mountain_pos)).toBe(true);

        // Then jump shouldn't be allowed
        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return true moving diagonally outside a range', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         M: Mountain
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | E |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | S | M |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   |   | NS|   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 1, column: 5 };
        const mountain_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 3, column: 6 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        const earth_mountain_1 = new EarthModel();
        new EarthController(earth_mountain_1).place(grid, mountain_pos, element_pool_manager);

        // Add second earth to convert the earth into Mountain and range the surrounding earths
        const earth_mountain_2 = new EarthModel();
        new EarthController(earth_mountain_2).place(grid, mountain_pos, element_pool_manager);

        expect(grid_controller.isRangeCell(earth_pos)).toBe(true);
        expect(grid_controller.isRangeCell(mountain_pos)).toBe(true);

        // Passing diagonally outside range should be valid
        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(true);
    })
   
    it('MovementManager.isSageMoveValid: should return false jumping through two ranges', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         M: Mountain
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | E | NS|   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | WL| M |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   | S |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 3, column: 4 };
        const wind_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 1, column: 5 };
        const mountain_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 1, column: 6 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        // Generate Whirlwind
        const wind: WindModel = new WindModel();
        new WindController(wind).increaseStackedWinds();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        const earth_mountain_1 = new EarthModel();
        new EarthController(earth_mountain_1).place(grid, mountain_pos, element_pool_manager);

        // Add second earth to convert the earth into Mountain and range the surrounding earths
        const earth_mountain_2 = new EarthModel();
        new EarthController(earth_mountain_2).place(grid, mountain_pos, element_pool_manager);

        expect(grid_controller.isRangeCell(earth_pos)).toBe(true);
        expect(grid_controller.isRangeCell(mountain_pos)).toBe(true);

        // Then jump shouldn't be allowed
        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isSageMoveValid: should return false jumping through two ranges (different position)', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         WL: Whirlwind
         NS: New Sage Position
         M: Mountain
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | E | S |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | WL| M |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |NS |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 1, column: 6 };
        const wind_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 1, column: 5 };
        const mountain_pos: Position = { row: 2, column: 6 };
        const new_pos: Position = { row: 3, column: 4 };
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        const earth_mountain_1 = new EarthModel();
        new EarthController(earth_mountain_1).place(grid, mountain_pos, element_pool_manager);

        // Add second earth to convert the earth into Mountain and range the surrounding earths
        const earth_mountain_2 = new EarthModel();
        new EarthController(earth_mountain_2).place(grid, mountain_pos, element_pool_manager);

        expect(grid_controller.isRangeCell(earth_pos)).toBe(true);
        expect(grid_controller.isRangeCell(mountain_pos)).toBe(true);

        // Generate Whirlwind
        const wind: WindModel = new WindModel();
        new WindController(wind).increaseStackedWinds();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);
        expect(new WindController(wind).getNumberOfStackedWinds()).toBe(2)

        // Then jump shouldn't be allowed
        const result = MovementManager.isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('MovementManager.isWindBlocked: should return true if wind is blocked', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | E |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   | S |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 3, column: 5 };
        const wind_pos: Position = { row: 2, column: 5 };
        const earth_pos: Position = { row: 1, column: 5 };
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);

        // Generate Whirlwind
        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(false);

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(true);
    })

    it('MovementManager.isWindBlocked: should return true if wind is blocked after another wind', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   | E |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   | S |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 3, column: 5 };
        const wind_pos: Position = { row: 2, column: 5 };
        const wind_pos_2: Position = { row: 1, column: 5 };
        const earth_pos: Position = { row: 0, column: 5 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);

        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(false);

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, earth_pos, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(true);
    })

    it('MovementManager.isWindBlocked: should return true if wind landing position is outside the boundaries', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | S |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 2, column: 5 };
        const wind_pos: Position = { row: 1, column: 5 };
        const wind_pos_2: Position = { row: 0, column: 5 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);

        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(true);
    })

    it('MovementManager.isWindBlocked: multiple wind chain not blocked', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   | F | W | F |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   | F | S | F |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   | F | F | F |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 3, column: 5 };
        const wind_pos: Position = { row: 2, column: 5 };
        const wind_pos_2: Position = { row: 1, column: 5 };
        const fire_pos_0: Position = { row: 2, column: 4 };
        const fire_pos_1: Position = { row: 3, column: 4 };
        const fire_pos_2: Position = { row: 4, column: 4 };
        const fire_pos_3: Position = { row: 4, column: 5 };
        const fire_pos_4: Position = { row: 4, column: 6 };
        const fire_pos_5: Position = { row: 3, column: 6 };
        const fire_pos_6: Position = { row: 2, column: 6 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);

        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);


        new FireController(new FireModel()).place(grid, fire_pos_0, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_1, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_2, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_3, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_4, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_5, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_6, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(false);
    })

    it('MovementManager.isWindBlocked: multiple wind chain with whirlding 1', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   | F | W2| F |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   | F | S | F |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   | F | F | F |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      8  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 4, column: 5 };
        const wind_pos: Position = { row: 3, column: 5 };
        const wind_pos_1: Position = { row: 3, column: 5 };
        const wind_pos_2: Position = { row: 2, column: 5 };
        const fire_pos_0: Position = { row: 3, column: 4 };
        const fire_pos_1: Position = { row: 4, column: 4 };
        const fire_pos_2: Position = { row: 5, column: 4 };
        const fire_pos_3: Position = { row: 5, column: 5 };
        const fire_pos_4: Position = { row: 5, column: 6 };
        const fire_pos_5: Position = { row: 4, column: 6 };
        const fire_pos_6: Position = { row: 3, column: 6 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);
        wind.stacked_winds = 2;
        const wind_1: WindModel = new WindModel();
        new WindController(wind_1).place(grid, wind_pos_1, element_pool_manager);
        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);


        new FireController(new FireModel()).place(grid, fire_pos_0, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_1, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_2, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_3, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_4, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_5, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_6, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(false);
    })

    it('MovementManager.isWindBlocked: multiple wind chain not blocked with whirlwind', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | W2 |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   | F | W | F |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   | F | S | F |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   | F | F | F |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      8  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 4, column: 5 };
        const wind_pos: Position = { row: 3, column: 5 };
        const wind_pos_1: Position = { row: 2, column: 5 };
        const wind_pos_2: Position = { row: 2, column: 5 };
        const fire_pos_0: Position = { row: 3, column: 4 };
        const fire_pos_1: Position = { row: 4, column: 4 };
        const fire_pos_2: Position = { row: 5, column: 4 };
        const fire_pos_3: Position = { row: 5, column: 5 };
        const fire_pos_4: Position = { row: 5, column: 6 };
        const fire_pos_5: Position = { row: 4, column: 6 };
        const fire_pos_6: Position = { row: 3, column: 6 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);
        const wind_1: WindModel = new WindModel();
        new WindController(wind_1).place(grid, wind_pos_1, element_pool_manager);
        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);


        new FireController(new FireModel()).place(grid, fire_pos_0, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_1, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_2, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_3, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_4, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_5, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_6, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(false);
    })

    it('MovementManager.isWindBlocked: multiple wind chain not blocked', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   | F | W | F |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   | F | S | F |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   | F | F | F |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      8  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 4, column: 5 };
        const wind_pos: Position = { row: 3, column: 5 };
        const wind_pos_1: Position = { row: 2, column: 5 };
        const wind_pos_2: Position = { row: 1, column: 5 };
        const fire_pos_0: Position = { row: 3, column: 4 };
        const fire_pos_1: Position = { row: 4, column: 4 };
        const fire_pos_2: Position = { row: 5, column: 4 };
        const fire_pos_3: Position = { row: 5, column: 5 };
        const fire_pos_4: Position = { row: 5, column: 6 };
        const fire_pos_5: Position = { row: 4, column: 6 };
        const fire_pos_6: Position = { row: 3, column: 6 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);
        const wind_1: WindModel = new WindModel();
        new WindController(wind_1).place(grid, wind_pos_1, element_pool_manager);
        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);


        new FireController(new FireModel()).place(grid, fire_pos_0, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_1, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_2, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_3, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_4, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_5, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_6, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(false);
    })

    it('MovementManager.isWindBlocked: multiple wind chain blocked at the end', async () => {
    /* test wind jumps with grid boundaries
         S: Sage
         W: Wind
         E: Earth
           0   1   2   3   4   5   6   7   8   9   10
         ---------------------------------------------
      0  |   |   |   |   |   | F |   |   |   |   |   |
         ---------------------------------------------
      1  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      2  |   |   |   |   |   | W |   |   |   |   |   |
         ---------------------------------------------
      3  |   |   |   |   | F | W | F |   |   |   |   |
         ---------------------------------------------
      4  |   |   |   |   | F | S | F |   |   |   |   |
         ---------------------------------------------
      5  |   |   |   |   | F | F | F |   |   |   |   |
         ---------------------------------------------
      6  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      8  |   |   |   |   |   |   |   |   |   |   |   |
         ---------------------------------------------
      */
        const cur_pos: Position = { row: 4, column: 5 };
        const wind_pos: Position = { row: 3, column: 5 };
        const wind_pos_1: Position = { row: 2, column: 5 };
        const wind_pos_2: Position = { row: 1, column: 5 };
        const fire_pos_7: Position = { row: 0, column: 5 };
        const fire_pos_0: Position = { row: 3, column: 4 };
        const fire_pos_1: Position = { row: 4, column: 4 };
        const fire_pos_2: Position = { row: 5, column: 4 };
        const fire_pos_3: Position = { row: 5, column: 5 };
        const fire_pos_4: Position = { row: 5, column: 6 };
        const fire_pos_5: Position = { row: 4, column: 6 };
        const fire_pos_6: Position = { row: 3, column: 6 };

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(11, 8);
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const wind: WindModel = new WindModel();
        new WindController(wind).place(grid, wind_pos, element_pool_manager);
        const wind_1: WindModel = new WindModel();
        new WindController(wind_1).place(grid, wind_pos_1, element_pool_manager);
        const wind_2: WindModel = new WindModel();
        new WindController(wind_2).place(grid, wind_pos_2, element_pool_manager);


        new FireController(new FireModel()).place(grid, fire_pos_0, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_1, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_2, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_3, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_4, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_5, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_6, element_pool_manager);
        new FireController(new FireModel()).place(grid, fire_pos_7, element_pool_manager);

        expect(MovementManager.isWindBlocked(grid, cur_pos, wind)).toBe(true);
    })

})