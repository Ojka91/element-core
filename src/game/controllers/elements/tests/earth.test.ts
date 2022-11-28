import { EarthModel } from "@/game/models/elements/earth"
import { WaterModel } from "@/game/models/elements/water"
import { EarthController } from "../earth_controller"

describe('EarthController: ruleOfReplacement', async () => {
    it('Rule of replacement: Should return true if replaces water or earth', async () => {
        const earth: EarthModel = new EarthModel()
        const earth_controller: EarthController = new EarthController(earth);

        expect(earth_controller.ruleOfReplacement(new WaterModel())).toBe(true)
        expect(earth_controller.ruleOfReplacement(new EarthModel())).toBe(true)
    })
/*
    it('Rule of replacement: Should return false if replaces a Mountain', async () => {
        const earth = new EarthModel()
        earth.promoteToMountain();
        const result = earth.ruleOfReplacement(new EarthModel())

        expect(result).toBe(false);
    })

    it('Rule of replacement: Should return false if replaces fire or wind', async () => {
        const earth = new EarthModel()
        const fire = earth.ruleOfReplacement(new Fire())
        const wind = earth.ruleOfReplacement(new Wind())

        expect(fire).toBe(false)
        expect(wind).toBe(false)
    })
*/
})

describe('EarthModel: reaction', () => {

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
    const grid: Grid = new Grid(9,7);
    const water_pos: Position = {row: 1, column: 1};
    const alone_earth_pos: Array<Position> = [
        {row: 6, column: 4},
        {row: 4, column: 5}
    ];
    const rangeable_earth_positions: Array<Position> = [
        {row: 0, column: 4},
        {row: 1, column: 2},
        {row: 1, column: 3},
        {row: 2, column: 1},
        {row: 2, column: 4},
        {row: 3, column: 1},
        {row: 4, column: 2},
    ];
    const earth_positions: Array<Position> = alone_earth_pos.concat(rangeable_earth_positions);

    const water = new Water();
    water.updatePosition(water_pos);
    grid.updateGridCell(water);
    earth_positions.forEach((earth_pos: Position) => {
        const earth = new EarthModel();
        earth.updatePosition(earth_pos);
        grid.updateGridCell(earth);
    });
    
    it.each(earth_positions)('Ensure earths are in being put in the grid', (earth_pos) => {
        expect(grid.isEarthModelCell(earth_pos)).toBe(true);
    });

    it('place: water must be replaced by earth', async () => {
        
        const earth = new EarthModel()

        expect(grid.isWaterCell(water_pos)).toBe(true);
        expect(earth.place(grid, water_pos)).toBe(true);

        expect(grid.isEarthModelCell(water_pos)).toBe(true);
    })

    it('place: earth must be promoted to mountain', async () => {
        const grid: Grid = new Grid(9,7);
        const earth_pos: Position = {row: 1, column: 1};
        const earth = new EarthModel()
        const new_earth: EarthModel = new EarthModel();

        expect(earth.place(grid, earth_pos)).toBe(true);
        expect(grid.isEarthModelCell(earth_pos)).toBe(true);
        expect(new_earth.place(grid, earth_pos)).toBe(true);
        
        expect(grid.isMountainCell(earth_pos)).toBe(true);
    })

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
    const place_earth_pos: Position = {row: 1, column: 2};
    const new_earth: EarthModel = new EarthModel();
    new_earth.place(grid, place_earth_pos);
    

    it.each(rangeable_earth_positions)('Reaction: range formation: check range formation succedded on rangeable earths', (earth_pos) => {
        expect(grid.isRangeCell(earth_pos)).toBe(true);
    });

    it.each(alone_earth_pos)('Reaction: range formation: check alone earths did not promoted to range', (earth_pos) => {
        expect(grid.isEarthModelCell(earth_pos)).toBe(true);
        expect(grid.isRangeCell(earth_pos)).toBe(false);
    })
})
  