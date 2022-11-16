import Grid, { Position } from "../../grid"
import { Earth } from "../earth"
import { Fire } from "../fire"
import { Water } from "../water"
import { Wind } from "../wind"

describe('Earth: ruleOfReplacement', () => {
    it('Rule of replacement: Should return true if replaces water or earth', async () => {
        const earth = new Earth()
        const water = earth.ruleOfReplacement(new Water())
        const replacedEarth = earth.ruleOfReplacement(new Earth())

        expect(water).toBe(true)
        expect(replacedEarth).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces a Mountain', async () => {
        const earth = new Earth()
        earth.promoteToMountain();
        const result = earth.ruleOfReplacement(new Earth())

        expect(result).toBe(false);
    })

    it('Rule of replacement: Should return false if replaces fire or wind', async () => {
        const earth = new Earth()
        const fire = earth.ruleOfReplacement(new Fire())
        const wind = earth.ruleOfReplacement(new Wind())

        expect(fire).toBe(false)
        expect(wind).toBe(false)
    })

})

describe('Earth: reaction', () => {

    /* 
        PE: Place Earth
        E: Earth
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
        const earth = new Earth();
        earth.updatePosition(earth_pos);
        grid.updateGridCell(earth);
    });
    
    it.each(earth_positions)('Ensure earths are in being put in the grid', (earth_pos) => {
        expect(grid.isEarthCell(earth_pos)).toBe(true);
    });

    it('reaction: water must be replaced by earth', async () => {
        
        const earth = new Earth()

        expect(grid.isWaterCell(water_pos)).toBe(true);
        earth.updatePosition(water_pos);
        earth.reaction(grid, water_pos);

        expect(grid.isEarthCell(water_pos)).toBe(true);
    })

    it('reaction: earth must be promoted to mountain', async () => {
        const grid: Grid = new Grid(9,7);
        const earth_pos: Position = {row: 1, column: 1};
        const earth = new Earth()
        const new_earth: Earth = new Earth();

        earth.updatePosition(earth_pos);
        new_earth.updatePosition(earth_pos);
        grid.updateGridCell(earth);

        expect(grid.isEarthCell(earth_pos)).toBe(true);
        new_earth.reaction(grid, earth_pos);
        
        expect(grid.isMountainCell(earth_pos)).toBe(true);
    })

    /* 
        PE: Place Earth
        E: Earth
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
    const new_earth: Earth = new Earth();
    new_earth.reaction(grid, place_earth_pos);
    

    it.each(rangeable_earth_positions)('Reaction: range formation: check range formation succedded on rangeable earths', (earth_pos) => {
        expect(grid.isRangeCell(earth_pos)).toBe(true);
    });

    it.each(alone_earth_pos)('Reaction: range formation: check alone earths did not promoted to range', (earth_pos) => {
        expect(grid.isEarthCell(earth_pos)).toBe(true);
        expect(grid.isRangeCell(earth_pos)).toBe(false);
    })
})
  