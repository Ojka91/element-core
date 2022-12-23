import { EarthModel } from "@/game/models/elements/earth";
import { FireModel } from "@/game/models/elements/fire";
import { WaterModel } from "@/game/models/elements/water";
import { WindModel } from "@/game/models/elements/wind";
import { ElementPoolManagerModel } from "@/game/models/element_pool";
import { GridModel } from "@/game/models/grid";
import { SageModel } from "@/game/models/pieces/sage";
import { Position } from "@/game/utils/position_utils";
import ElementPoolManager from "../../element_pool_controller";
import GridController from "../../grid_controller";
import { SageController } from "../../pieces/sage_controller";
import { EarthController } from "../earth_controller";
import { WaterController } from "../water_controller";


describe('WaterController: ruleOfReplacement', () => {
    let result;
    it('Rule of replacement: Should return true if replaces Fire', async () => {
        const water = new WaterModel()
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        result = new WaterController(water).ruleOfReplacement(new FireModel(), element_pool_manager)

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces anything else', async () => {
        const water = new WaterModel()
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        result = new WaterController(water).ruleOfReplacement(new EarthModel(), element_pool_manager)
        expect(result).toBe(false)
        result = new WaterController(water).ruleOfReplacement(new WindModel(), element_pool_manager)
        expect(result).toBe(false)
        result = new WaterController(water).ruleOfReplacement(new WaterModel(), element_pool_manager)
        expect(result).toBe(false)

    })

})

describe('WaterController: reaction', () => {
    it('reaction: Should return nothing if no river is formed', async () => {
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);

        // Perform water reaction
        const result = new WaterController(placed_water).reaction(grid, placed_water_pos);
        expect(result == null).toBe(true);
    })

    it('reaction: Should throw error if placed water forms a river but no rivers are passed', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 4 },
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            { row: 3, column: 6 },
            { row: 3, column: 7 }
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);
        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);

        // Perform water reaction tests
        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, [], new_water_sequence);
        }).toThrow("Water reaction requires an old river array with at least 1 position. Got undefined or 0");

        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, undefined, new_water_sequence);
        }).toThrow("Water reaction requires an old river array with at least 1 position. Got undefined or 0");

        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list);
        }).toThrow("Water reaction requires a new river array with at least 1 position. Got undefined or 0");

        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, []);
        }).toThrow("Water reaction requires a new river array with at least 1 position. Got undefined or 0");

    })

    it('reaction: Should throw error if current river length + placed water is different than new river length', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 4 },
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            { row: 3, column: 6 },
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);
        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);

        // Perform water reaction tests
        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river must have the old river length + 1");
    })

    it('reaction: Should throw error if river heads are not orthogonal to placed water', async () => {

        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 4 },
            { row: 3, column: 3 },
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            { row: 3, column: 6 },
            { row: 3, column: 7 },
            { row: 3, column: 8 },
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);
        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);

        // Perform water reaction tests
        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, JSON.parse(JSON.stringify(water_pos_list)).reverse(), new_water_sequence);
        }).toThrow("River is illegal. Heads of the rivers must be opposite to the new water piece position");

        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, JSON.parse(JSON.stringify(new_water_sequence)).reverse());
        }).toThrow("River is illegal. Heads of the rivers must be opposite to the new water piece position");
    })

    it('reaction: Invalid original river passed should throw error', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot
            E: Earth

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   | E | W | PW|   |   |   |   |        3  |   |   |   |   |   |   | NW| NW| NW|   | <-- Wrong!
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   |   |   |   |   |   |   |        4  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |        5  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |        6  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |        7  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const water_pos_list: Array<Position> = [
            { row: 3, column: 4 },
            { row: 3, column: 3 }
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            { row: 3, column: 6 },
            { row: 3, column: 7 },
            { row: 3, column: 8 }
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full


        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        const earth: EarthModel = new EarthModel();
        new EarthController(earth).place(grid, water_pos_list[1], element_pool_manager);


        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("River data provided is invalid")

    })

    it('reaction: Should move river horizontally to placed water', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   | W | PW|   |   |   |   |        3  |   |   |   |   |   |   | NW| NW|   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   |   |   |   |   |   |   |        4  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |        5  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |        6  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |        7  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 4 },
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            { row: 3, column: 6 },
            { row: 3, column: 7 }
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence) {
            expect(grid_controller.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list) {
            expect(grid_controller.isWaterCell(pos)).toBe(false);
        }
        expect(grid_controller.isWaterCell(placed_water_pos)).toBe(false);

    })

    it('reaction: Should move river vertically to placed water', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   | W |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   | W |   |   |   |   |   |        3  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   | PW|   |   |   |   |   |        4  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |        5  |   |   |   |   | NW|   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |        6  |   |   |   |   | NW|   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |        7  |   |   |   |   | NW|   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 4 },
            { row: 2, column: 4 },
        ]
        const placed_water_pos: Position = {
            row: 4, column: 4
        }
        const new_water_sequence: Array<Position> = [
            { row: 5, column: 4 },
            { row: 6, column: 4 },
            { row: 7, column: 4 }
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence) {
            expect(grid_controller.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list) {
            expect(grid_controller.isWaterCell(pos)).toBe(false);
        }
        expect(grid_controller.isWaterCell(placed_water_pos)).toBe(false);

    })

    it('reaction: River can change directions but always orthogonally', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   | W |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   | W |   |   |   |   |   |        3  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   | W |   |   |   |   |   |        4  |   |   |   |   |   | NW|   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   | W |   |   |   |   |   |        5  |   |   |   |   |   | NW| NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   | W |   |   |   |   |   |        6  |   |   |   |   |   |   | NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   | PW|   |   |   |   |   |        7  |   |   |   |   |   | NW| NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const placed_water_pos: Position = {
            row: 7, column: 4
        }
        const water_pos_list: Array<Position> = [
            { row: 6, column: 4 },
            { row: 5, column: 4 },
            { row: 4, column: 4 },
            { row: 3, column: 4 },
            { row: 2, column: 4 },
        ]

        const new_water_sequence: Array<Position> = [
            { row: 7, column: 5 },
            { row: 7, column: 6 },
            { row: 6, column: 6 },
            { row: 5, column: 6 },
            { row: 5, column: 5 },
            { row: 4, column: 5 },
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence) {
            expect(grid_controller.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list) {
            expect(grid_controller.isWaterCell(pos)).toBe(false);
        }
        expect(grid_controller.isWaterCell(placed_water_pos)).toBe(false);

    })

    it('reaction: River can replace fire', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot
            F: Fire

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   | W |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   | W |   |   |   |   |   |        3  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   | W | F |   |   |   |   |        4  |   |   |   |   |   | NW|   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   | W | F |   |   |   |   |        5  |   |   |   |   |   | NW| NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   | W |   | F |   |   |   |        6  |   |   |   |   |   |   | NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   | PW| F |   |   |   |   |        7  |   |   |   |   |   | NW| NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const placed_water_pos: Position = {
            row: 7, column: 4
        }
        const water_pos_list: Array<Position> = [
            { row: 6, column: 4 },
            { row: 5, column: 4 },
            { row: 4, column: 4 },
            { row: 3, column: 4 },
            { row: 2, column: 4 },
        ]

        const new_water_sequence: Array<Position> = [
            { row: 7, column: 5 },
            { row: 7, column: 6 },
            { row: 6, column: 6 },
            { row: 5, column: 6 },
            { row: 5, column: 5 },
            { row: 4, column: 5 },
        ]

        const fire_pos_list: Array<Position> = [
            { row: 7, column: 5 },
            { row: 6, column: 6 },
            { row: 5, column: 5 },
            { row: 4, column: 5 },
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)
        element_pool_manager.emptyPool(); // Empty pool so when replacement happens and element go back to pool, the pool is not full

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        fire_pos_list.forEach((fire_pos) => {
            const fire: FireModel = new FireModel();
            new WaterController(fire).place(grid, fire_pos, element_pool_manager);
        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence, element_pool_manager);

        for (let pos of new_water_sequence) {
            expect(grid_controller.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list) {
            expect(grid_controller.isWaterCell(pos)).toBe(false);
        }
        expect(grid_controller.isWaterCell(placed_water_pos)).toBe(false);

    })

    it('reaction: cannot allow river formation over earth, winds or other waters', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot
            X: Other element

                        Initial Board                                      After reaction board
             0   1   2   3   4   5   6   7   8   9               0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   | W |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   | W |   |   |   |   |   |        3  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   | W |   |   |   |   |   |        4  |   |   |   |   |   | NW|   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   | W |   |   |   |   |   |        5  |   |   |   |   |   | NW| NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   | W |   |   |   |   |   |        6  |   |   |   |   |   |   | NW|   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   | PW|   | X |   |   |   |        7  |   |   |   |   |   | NW| X |   |   |   | <-- Wrong!
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const placed_water_pos: Position = {
            row: 7, column: 4
        }
        const water_pos_list: Array<Position> = [
            { row: 6, column: 4 },
            { row: 5, column: 4 },
            { row: 4, column: 4 },
            { row: 3, column: 4 },
            { row: 2, column: 4 },
        ]

        const new_water_sequence: Array<Position> = [
            { row: 7, column: 5 },
            { row: 7, column: 6 },
            { row: 6, column: 6 },
            { row: 5, column: 6 },
            { row: 5, column: 5 },
            { row: 4, column: 5 },
        ]

        const other_element_pos: Position = {
            row: 7, column: 6
        }
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        /* 
        TEST WITH other element: Earth
        */
        const earth: EarthModel = new EarthModel();
        new WaterController(earth).place(grid, other_element_pos, element_pool_manager);


        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        /* 
        TEST WITH other element: Water
        */
        const water: WaterModel = new WaterModel();
        new WaterController(water).place(grid, other_element_pos, element_pool_manager);


        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        /* 
        TEST WITH other element: Wind
        */
        const wind: WindModel = new WindModel();
        new WaterController(wind).place(grid, other_element_pos, element_pool_manager);


        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        /* 
        TEST WITH other element: Sage
        */
        const sage: SageModel = new SageModel();
        new SageController(sage).updatePosition(other_element_pos);
        grid_controller.updateGridCell(sage);


        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");



    })

    it('reaction: cannot move outside boundaries', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   | W |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   |   |   |   |   |   | W |        3  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   |   |   |   |   |   | PW|        4  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |        5  |   |   |   |   |   |   |   |   |   | W |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |        6  |   |   |   |   |   |   |   |   |   | W | W   <-- Wrong!!!
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |        7  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 9 },
            { row: 2, column: 9 },
        ]
        const placed_water_pos: Position = {
            row: 4, column: 9
        }
        const new_water_sequence: Array<Position> = [
            { row: 5, column: 9 },
            { row: 6, column: 9 },
            { row: 6, column: 10 }
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

    })

    it('reaction: Should throw error on non-orthogonal old river', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot

                        Initial Board                                      After reaction board
            0   1   2   3   4   5   6   7   8   9                0   1   2   3   4   5   6   7   8   9
            -----------------------------------------           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   | W |        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        3  |   |   |   |   |   |   |   |   |   | W |        3  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        4  |   |   |   |   |   |   |   |   |   | PW|        4  |   |   |   |   |   | W |   | W | W |   | <-- wrong!!
            -----------------------------------------           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |        5  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |        6  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |        7  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------           -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        const water_pos_list: Array<Position> = [
            { row: 3, column: 9 },
            { row: 1, column: 9 },
        ]
        const placed_water_pos: Position = {
            row: 4, column: 9
        }
        const new_water_sequence: Array<Position> = [
            { row: 4, column: 8 },
            { row: 4, column: 7 },
            { row: 4, column: 5 }
        ]
        const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
        const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: WaterModel = new WaterModel();
            new WaterController(water).place(grid, water_pos, element_pool_manager);

        })

        // Place water
        const placed_water: WaterModel = new WaterModel();
        new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);


        // Perform water reaction
        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        // Fix new river
        new_water_sequence[2].column = 6;

        expect(() => {
            new WaterController(placed_water).reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("River data provided is invalid");

    })

    it('reaction: Should return rivers available', async () => {

      /* 
        W: Water
        PW: Placed Water

           0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   |   |   | W |   |   |   |   |   | 
         -----------------------------------------
      3  |   |   |   |PW | W | W |   |   |   |   |  <- Horitzontal river 
         -----------------------------------------
      4  |   |   |   | W |   |   |   |   |   |   |
         -----------------------------------------
      5  |   |   |   | W |   |   |   |   |   |   |
         -----------------------------------------
      6  |   |   |   | W | W |   |   |   |   |   |
         -----------------------------------------
      7  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
                       ^
                       | 
                vertical river
      
         */
    })

    const placed_water_pos: Position = { row: 3, column: 3 }

    const river_1: Array<Position> = [
        { row: 3, column: 3 },
        { row: 3, column: 4 },
        { row: 3, column: 5 }
    ]
    
    const river_2: Array<Position> = [
        { row: 3, column: 3 },
        { row: 4, column: 3 },
        { row: 5, column: 3 },
        { row: 6, column: 3 }
    ]

    const rivers: Array<Array<Position>> = [river_1, river_2];

    const waterPositions: Array<Position> = [
        { row: 2, column: 4 },
        { row: 3, column: 4 },
        { row: 3, column: 5 },
        { row: 4, column: 3 },
        { row: 5, column: 3 },
        { row: 6, column: 3 },
        { row: 6, column: 4 }
    ]

    const grid: GridModel = new GridModel();
    const grid_controller: GridController = new GridController(grid);
    grid_controller.generateInitialGrid(10, 8);

    const element_pool_manager_model: ElementPoolManagerModel = new ElementPoolManagerModel()
    const element_pool_manager: ElementPoolManager = new ElementPoolManager(element_pool_manager_model)

    // Prepare grid
    waterPositions.forEach((water_pos) => {
        const water: WaterModel = new WaterModel();
        new WaterController(water).place(grid, water_pos, element_pool_manager);

    })

    // Place water
    const placed_water: WaterModel = new WaterModel();
    new WaterController(placed_water).place(grid, placed_water_pos, element_pool_manager);

    expect(new WaterController(placed_water).getRivers(grid, placed_water_pos).sort()).toEqual(rivers.sort());

})
