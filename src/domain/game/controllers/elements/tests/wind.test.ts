import { EarthModel } from "@/domain/game/models/elements/earth";
import { FireModel } from "@/domain/game/models/elements/fire";
import { WaterModel } from "@/domain/game/models/elements/water";
import { WindModel } from "@/domain/game/models/elements/wind";
import { ElementPoolManagerModel } from "@/domain/game/models/element_pool";
import { GridModel } from "@/domain/game/models/grid";
import { Position } from "@/domain/game/utils/position_utils";
import ElementPoolManager from "../../element_pool_controller";
import GridController from "../../grid_controller";
import { EarthController } from "../earth_controller";
import { WindController } from "../wind_controller";


describe('WindController: Rule of replacement', () => {

    it('Rule of replacement: Should return true if replaces Earth', async () => {
        const wind = new WindModel();
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        const result = new WindController(wind).ruleOfReplacement(new EarthModel(), element_pool_manager)

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return true if replaces Wind', async () => {
        const wind = new WindModel();
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        const result = new WindController(wind).ruleOfReplacement(new WindModel(), element_pool_manager)

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces anything else', async () => {
        let result;
        const wind = new WindModel();
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        result = new WindController(wind).ruleOfReplacement(new FireModel(), element_pool_manager)
        expect(result).toBe(false)

        result = new WindController(wind).ruleOfReplacement(new WaterModel(), element_pool_manager)
        expect(result).toBe(false)

    })

    it('Rule of replacement: Should return false if replacing a max whirlwind', async () => {
        const wind = new WindModel();

        const whirlwind: WindModel = new WindModel();
        new WindController(whirlwind).increaseStackedWinds();
        new WindController(whirlwind).increaseStackedWinds();
        new WindController(whirlwind).increaseStackedWinds();
        new WindController(whirlwind).increaseStackedWinds();

        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        
        expect(new WindController(whirlwind).isMaxWhirlwind()).toBe(true);
        const result = new WindController(wind).ruleOfReplacement(whirlwind, element_pool_manager);

        expect(result).toBe(true)

    })

})

describe('WindController: place', () => {
    it('place: it should stack winds', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        let wind: WindModel = new WindModel();
        const new_wind: WindModel = new WindModel();
        const pos: Position = { row: 1, column: 1 };
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Set grid
        new WindController(wind).place(grid, pos, element_pool_manager);
        new WindController(new_wind).place(grid, pos, element_pool_manager);

        expect(grid_controller.isWhirlwindCell(pos)).toBe(true);
        wind = grid_controller.getGridCellByPosition(pos) as WindModel
        expect(new WindController(wind).getNumberOfStackedWinds() == 2).toBe(true);
    })

    it('place: it should not stack winds on a max whirlwind', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        let wind: WindModel = new WindModel();
        const pos: Position = { row: 1, column: 1 };
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Set grid
        new WindController(wind).place(grid, pos, element_pool_manager);

        for (let stacked_winds: number = 1; stacked_winds < 5; stacked_winds++) {
            wind = grid_controller.getGridCellByPosition(pos) as WindModel
            expect(new WindController(wind).getNumberOfStackedWinds() == stacked_winds).toBe(true);

            const new_wind: WindModel = new WindModel();
            new WindController(new_wind).place(grid, pos, element_pool_manager);
        }

        wind = grid_controller.getGridCellByPosition(pos) as WindModel
        expect(new WindController(wind).getNumberOfStackedWinds() == 5).toBe(false);
    })

    it('place: it should replace earth', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const earth: EarthModel = new EarthModel();
        const new_wind: WindModel = new WindModel();
        const pos: Position = { row: 1, column: 1 };
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full


        // Set grid
        new EarthController(earth).place(grid, pos, element_pool_manager);

        expect(grid_controller.isEarthCell(pos)).toBe(true);
        new WindController(new_wind).place(grid, pos, element_pool_manager);
        expect(grid_controller.isWindCell(pos)).toBe(true);
    })

    it('place: it should not replace mountains nor ranges', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const earth: EarthModel = new EarthModel();
        const new_wind: WindModel = new WindModel();
        const pos: Position = { row: 1, column: 1 };
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Set grid
        new EarthController(earth).promoteToMountain();
        new EarthController(earth).place(grid, pos, element_pool_manager);

        expect(grid_controller.isMountainCell(pos)).toBe(true);
        new WindController(new_wind).place(grid, pos, element_pool_manager);
        expect(grid_controller.isWindCell(pos)).toBe(false);

        expect(grid_controller.isRangeCell(pos)).toBe(true);
        new WindController(new_wind).place(grid, pos, element_pool_manager);
        expect(grid_controller.isWindCell(pos)).toBe(false);
    })

    it('reaction: There is no earth reaction', () => {
        
        const grid: GridModel = new GridModel();
        const piece_pos: Position = { row: 1, column: 1 };

        expect(new WindController(new WindModel()).reaction(grid, piece_pos) == null).toBe(true);
    })

})