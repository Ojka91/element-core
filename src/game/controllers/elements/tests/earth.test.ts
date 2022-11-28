import { EarthModel } from "@/game/models/elements/earth"
import { FireModel } from "@/game/models/elements/fire"
import { WaterModel } from "@/game/models/elements/water"
import { WindModel } from "@/game/models/elements/wind"
import { GridModel } from "@/game/models/grid"
import { Position } from "@/game/utils/position_utils"
import GridController from "../../grid_controller"
import { EarthController } from "../earth_controller"
import { FireController } from "../fire_controller"
import { WaterController } from "../water_controller"
import { WindController } from "../wind_controller"

describe('EarthController: ruleOfReplacement', () => {
    it('Rule of replacement: Should return true if replaces water or earth', () => {
        const earth: EarthModel = new EarthModel()
        const earth_controller: EarthController = new EarthController(earth);

        expect(earth_controller.ruleOfReplacement(new WaterModel())).toBe(true)
        expect(earth_controller.ruleOfReplacement(new EarthModel())).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces a Mountain', () => {
        const earth: EarthModel = new EarthModel()
        const earth_controller: EarthController = new EarthController(earth);

        earth_controller.promoteToMountain();
        expect(earth_controller.ruleOfReplacement(new EarthModel())).toBe(false);
    })

    it('Rule of replacement: Should return false if replaces fire or wind', () => {
        const earth: EarthModel = new EarthModel()
        const earth_controller: EarthController = new EarthController(earth);

        const fire = earth_controller.ruleOfReplacement(new FireModel())
        const wind = earth_controller.ruleOfReplacement(new WindModel())

        expect(fire).toBe(false)
        expect(wind).toBe(false)
    })
})

describe('EarthModel: reaction', () => {

    const alone_earth_pos: Array<Position> = [
        { row: 6, column: 4 },
        { row: 4, column: 5 }
    ];
    const rangeable_earth_positions: Array<Position> = [
        { row: 0, column: 4 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 2, column: 1 },
        { row: 2, column: 4 },
        { row: 3, column: 1 },
        { row: 4, column: 2 },
    ];

    const earth_positions: Array<Position> = alone_earth_pos.concat(rangeable_earth_positions);

    it('Ensure earths are in being put in the grid', () => {
        /* 
        PE: Place EarthModel
        E: EarthModel
        PM: Promoted Mountain
            0   1   2   3   4   5   6   7   8   9 
        -----------------------------------------
    0  |   |   |   |   | E |   |   |   |   |   |
        -----------------------------------------
    1  |   | W | E | E |   |   |   |   |   |   |
        -----------------------------------------
    2  |   | E |   |   | E |   |   |   |   |   |
        -----------------------------------------
    3  |   | E |   |   |   |   |   |   |   |   |
        -----------------------------------------
    4  |   |   | E |   |   | E |   |   |   |   |
        -----------------------------------------
    5  |   |   |   |   |   |   |   |   |   |   |
        -----------------------------------------
    6  |   |   |   |   | E |   |   |   |   |   |
        -----------------------------------------
    7  |   |   |   |   |   |   |   |   |   |   |
        -----------------------------------------
    */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const water_pos: Position = { row: 1, column: 1 };


        const water = new WaterModel();
        new WaterController(water).updatePosition(water_pos);
        grid_controller.updateGridCell(water);
        earth_positions.forEach((earth_pos: Position) => {
            const earth = new EarthModel();
            new EarthController(earth).updatePosition(earth_pos);
            grid_controller.updateGridCell(earth);
        });

        for (let pos of earth_positions) {
            expect(grid_controller.isEarthCell(pos)).toBe(true);
        }
    });

    it('place: only water must be replaced by earth', () => {
        /* 
        PE: Place EarthModel
        E: EarthModel
        PM: Promoted Mountain
            0   1   2   3   4   5   6   7   8   9 
        -----------------------------------------
    0  |   |   |   |   | E |   |   |   |   |   |
        -----------------------------------------
    1  |   | W | E | E |   |   |   |   |   |   |
        -----------------------------------------
    2  |   | E |   |   | E |   |   |   |   |   |
        -----------------------------------------
    3  |   | E |   |   |   |   |   |   |   |   |
        -----------------------------------------
    4  |   |   | E |   |   | E |   |   |   |   |
        -----------------------------------------
    5  |   |   |   |   |   |   |   |   |   |   |
        -----------------------------------------
    6  |   |   |   |   | E |   |   |   |   |   |
        -----------------------------------------
    7  |   |   |   |   |   |   |   |   |   |   |
        -----------------------------------------
    */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const piece_pos: Position = { row: 1, column: 1 };


        const water = new WaterModel();
        new WaterController(water).updatePosition(piece_pos);
        grid_controller.updateGridCell(water);
        earth_positions.forEach((earth_pos: Position) => {
            const earth = new EarthModel();
            new EarthController(earth).updatePosition(earth_pos);
            grid_controller.updateGridCell(earth);
        });

        const earth = new EarthModel()
        const earth_controller = new EarthController(earth);

        expect(grid_controller.isWaterCell(piece_pos)).toBe(true);
        expect(earth_controller.place(grid, piece_pos)).toBe(true);

        expect(grid_controller.isEarthCell(piece_pos)).toBe(true);

        // rest of elements are not allowed
        const wind = new WindModel();
        new WindController(wind).updatePosition(piece_pos);
        grid_controller.updateGridCell(wind);
        expect(earth_controller.place(grid, piece_pos)).toBe(false);

        const fire = new FireModel();
        new FireController(fire).updatePosition(piece_pos);
        grid_controller.updateGridCell(fire);
        expect(earth_controller.place(grid, piece_pos)).toBe(false);
    })

    it('place: earth must be promoted to mountain', () => {
        /* 
        PE: Place EarthModel
        E: EarthModel
        PM: Promoted Mountain
            0   1   2   3   4   5   6   7   8   9 
        -----------------------------------------
    0  |   |   |   |   | E |   |   |   |   |   |
        -----------------------------------------
    1  |   | W | E | E |   |   |   |   |   |   |
        -----------------------------------------
    2  |   | E |   |   | E |   |   |   |   |   |
        -----------------------------------------
    3  |   | E |   |   |   |   |   |   |   |   |
        -----------------------------------------
    4  |   |   | E |   |   | E |   |   |   |   |
        -----------------------------------------
    5  |   |   |   |   |   |   |   |   |   |   |
        -----------------------------------------
    6  |   |   |   |   | E |   |   |   |   |   |
        -----------------------------------------
    7  |   |   |   |   |   |   |   |   |   |   |
        -----------------------------------------
    */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);

        const water_pos: Position = { row: 1, column: 1 };

        const water = new WaterModel();
        new WaterController(water).updatePosition(water_pos);
        grid_controller.updateGridCell(water);
        earth_positions.forEach((earth_pos: Position) => {
            const earth = new EarthModel();
            new EarthController(earth).updatePosition(earth_pos);
            grid_controller.updateGridCell(earth);
        });
        grid_controller.generateInitialGrid(10, 8);
        const earth_pos: Position = { row: 1, column: 1 };
        const earth = new EarthModel()
        const new_earth: EarthModel = new EarthModel();

        expect(new EarthController(earth).place(grid, earth_pos)).toBe(true);
        expect(grid_controller.isEarthCell(earth_pos)).toBe(true);
        expect(new EarthController(new_earth).place(grid, earth_pos)).toBe(true);
        expect(grid_controller.isMountainCell(earth_pos)).toBe(true);

        // Check it cannot be promoted twice
        expect(new EarthController(new_earth).place(grid, earth_pos)).toBe(false);
        expect(grid_controller.isMountainCell(earth_pos)).toBe(true);
    })

    it('formRange: range formation', () => {
        /* 
            PE: Place EarthModel
            E: EarthModel
            PM: Promoted Mountain
             0   1   2   3   4   5   6   7   8   9 
            -----------------------------------------
        0  |   |   |   |   | E |   |   |   |   |   |
            -----------------------------------------
        1  |   | W | PE| E |   |   |   |   |   |   |
            -----------------------------------------
        2  |   | E |   |   | E |   |   |   |   |   |
            -----------------------------------------
        3  |   | E |   |   |   |   |   |   |   |   |
            -----------------------------------------
        4  |   |   | E |   |   | E |   |   |   |   |
            -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        6  |   |   |   |   | E |   |   |   |   |   |
            -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const grid_controller: GridController = new GridController(grid);
        grid_controller.generateInitialGrid(10, 8);
        earth_positions.forEach((earth_pos: Position) => {
            const earth = new EarthModel();
            new EarthController(earth).updatePosition(earth_pos);
            grid_controller.updateGridCell(earth);
        });

        const place_earth_pos: Position = { row: 1, column: 2 };
        const new_earth: EarthModel = new EarthModel();
        new EarthController(new_earth).place(grid, place_earth_pos);

        for (let pos of rangeable_earth_positions) {
            expect(grid_controller.isRangeCell(pos)).toBe(true);
        }

        for (let pos of alone_earth_pos) {
            expect(grid_controller.isEarthCell(pos)).toBe(true);
            expect(grid_controller.isRangeCell(pos)).toBe(false);
        }
    })

    it('reaction: There is no earth reaction', () => {
        /* 
            PE: Place EarthModel
            E: EarthModel
            PM: Promoted Mountain
             0   1   2   3   4   5   6   7   8   9 
            -----------------------------------------
        0  |   |   |   |   | E |   |   |   |   |   |
            -----------------------------------------
        1  |   | W | PE| E |   |   |   |   |   |   |
            -----------------------------------------
        2  |   | E |   |   | E |   |   |   |   |   |
            -----------------------------------------
        3  |   | E |   |   |   |   |   |   |   |   |
            -----------------------------------------
        4  |   |   | E |   |   | E |   |   |   |   |
            -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        6  |   |   |   |   | E |   |   |   |   |   |
            -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        */
        const grid: GridModel = new GridModel();
        const piece_pos: Position = { row: 1, column: 1 };

        expect(new EarthController(new EarthModel()).reaction(grid, piece_pos) == null).toBe(true);
    })
})
