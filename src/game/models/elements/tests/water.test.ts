import Grid, { Position } from "../../grid"
import { Earth } from "../earth"
import { Fire } from "../fire"
import { Water } from "../water"
import { Wind } from "../wind"

describe('Water: ruleOfReplacement', () => {
    let result;
    it('Rule of replacement: Should return true if replaces Fire', async () => {
        const water = new Water()
        result = water.ruleOfReplacement(new Fire())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces anything else', async () => {
        const water = new Water()
        result = water.ruleOfReplacement(new Earth())
        expect(result).toBe(false)
        result = water.ruleOfReplacement(new Wind())
        expect(result).toBe(false)
        result = water.ruleOfReplacement(new Water())
        expect(result).toBe(false)
    
    })

})

describe('Water: reaction', () => {
    it('reaction: Should move river orthogonally', async () => {
        /* 
            PW: Placed Water
            W: Water
            NW: New Water Spot
            0   1   2   3   4   5   6   7   8   9 
            -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |
            -----------------------------------------
        3  |   |   |   |   | W | PW| NW| NW|   |   |
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
        const grid: Grid = new Grid(7, 9);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 4}, 
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            {row: 3, column: 6},
            {row: 3, column: 7}
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos)

        expect(placed_water.isValidRiver(grid, placed_water_pos, water_pos_list)).toBe(true);
        expect(placed_water.isValidRiver(grid, placed_water_pos, new_water_sequence)).toBe(true);

        // Perform water reaction
        placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence){
            expect(grid.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list){
            expect(grid.isWaterCell(pos)).toBe(false);
        }

    })
})
  