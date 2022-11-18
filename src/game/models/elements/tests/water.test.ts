import Grid, { Position } from "../../grid"
import { Sage } from "../../pieces"
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
    it('reaction: Should return nothing if no river is formed', async () => {
        const grid: Grid = new Grid(10, 8);
        const placed_water_pos: Position = {
            row: 3, column: 5
        }

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        const result = placed_water.reaction(grid, placed_water_pos);
        expect(result == null).toBe(true);
    })

    it('reaction: Should throw error if placed water forms a river but no rivers are passed', async () => {
        
        const grid: Grid = new Grid(10, 8);
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
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction tests
        expect(() => {
            placed_water.reaction(grid, placed_water_pos, [], new_water_sequence);
        }).toThrow("Water reaction requires an old river array with at least 1 position. Got undefined or 0");

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, undefined, new_water_sequence);
        }).toThrow("Water reaction requires an old river array with at least 1 position. Got undefined or 0");

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list);
        }).toThrow("Water reaction requires a new river array with at least 1 position. Got undefined or 0");

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, []);
        }).toThrow("Water reaction requires a new river array with at least 1 position. Got undefined or 0");
        
    })

    it('reaction: Should throw error if current river length + placed water is different than new river length', async () => {
        
        const grid: Grid = new Grid(10, 8);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 4}, 
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            {row: 3, column: 6},
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction tests
        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river must have the old river length + 1");
    })

    it('reaction: Should throw error if river heads are not orthogonal to placed water', async () => {
        
        const grid: Grid = new Grid(10, 8);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 4},
            {row: 3, column: 3}, 
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            {row: 3, column: 6},
            {row: 3, column: 7},
            {row: 3, column: 8},
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction tests
        expect(() => {
            placed_water.reaction(grid, placed_water_pos, JSON.parse(JSON.stringify(water_pos_list)).reverse(), new_water_sequence);
        }).toThrow("River is illegal. Heads of the rivers must be opposite to the new water piece position");

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, JSON.parse(JSON.stringify(new_water_sequence)).reverse());
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
        const grid: Grid = new Grid(9, 8);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 4}, 
            {row: 3, column: 3}
        ]
        const placed_water_pos: Position = {
            row: 3, column: 5
        }
        const new_water_sequence: Array<Position> = [
            {row: 3, column: 6},
            {row: 3, column: 7},
            {row: 3, column: 8}
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        const earth: Earth = new Earth();
        earth.updatePosition(water_pos_list[1]);
        grid.updateGridCell(earth);

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
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
        const grid: Grid = new Grid(10, 8);
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
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence){
            expect(grid.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list){
            expect(grid.isWaterCell(pos)).toBe(false);
        }
        expect(grid.isWaterCell(placed_water_pos)).toBe(false);

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
        const grid: Grid = new Grid(10, 8);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 4},
            {row: 2, column: 4},
        ]
        const placed_water_pos: Position = {
            row: 4, column: 4
        }
        const new_water_sequence: Array<Position> = [
            {row: 5, column: 4},
            {row: 6, column: 4},
            {row: 7, column: 4}
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence){
            expect(grid.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list){
            expect(grid.isWaterCell(pos)).toBe(false);
        }
        expect(grid.isWaterCell(placed_water_pos)).toBe(false);

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
        const grid: Grid = new Grid(10, 8);
        
        const placed_water_pos: Position = {
            row: 7, column: 4
        }
        const water_pos_list: Array<Position> = [
            {row: 6, column: 4},
            {row: 5, column: 4},
            {row: 4, column: 4},
            {row: 3, column: 4},
            {row: 2, column: 4},
        ]
        
        const new_water_sequence: Array<Position> = [
            {row: 7, column: 5},
            {row: 7, column: 6},
            {row: 6, column: 6},
            {row: 5, column: 6},
            {row: 5, column: 5},
            {row: 4, column: 5},
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence){
            expect(grid.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list){
            expect(grid.isWaterCell(pos)).toBe(false);
        }
        expect(grid.isWaterCell(placed_water_pos)).toBe(false);

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
        const grid: Grid = new Grid(10, 8);
        
        const placed_water_pos: Position = {
            row: 7, column: 4
        }
        const water_pos_list: Array<Position> = [
            {row: 6, column: 4},
            {row: 5, column: 4},
            {row: 4, column: 4},
            {row: 3, column: 4},
            {row: 2, column: 4},
        ]
        
        const new_water_sequence: Array<Position> = [
            {row: 7, column: 5},
            {row: 7, column: 6},
            {row: 6, column: 6},
            {row: 5, column: 6},
            {row: 5, column: 5},
            {row: 4, column: 5},
        ]

        const fire_pos_list: Array<Position> = [
            {row: 7, column: 5},
            {row: 6, column: 6},
            {row: 5, column: 5},
            {row: 4, column: 5},
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        fire_pos_list.forEach((fire_pos) => {
            const fire: Fire = new Fire();
            fire.updatePosition(fire_pos);
            grid.updateGridCell(fire);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);

        for (let pos of new_water_sequence){
            expect(grid.isWaterCell(pos)).toBe(true);
        }

        for (let pos of water_pos_list){
            expect(grid.isWaterCell(pos)).toBe(false);
        }
        expect(grid.isWaterCell(placed_water_pos)).toBe(false);

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
        const grid: Grid = new Grid(10, 8);
        
        const placed_water_pos: Position = {
            row: 7, column: 4
        }
        const water_pos_list: Array<Position> = [
            {row: 6, column: 4},
            {row: 5, column: 4},
            {row: 4, column: 4},
            {row: 3, column: 4},
            {row: 2, column: 4},
        ]
        
        const new_water_sequence: Array<Position> = [
            {row: 7, column: 5},
            {row: 7, column: 6},
            {row: 6, column: 6},
            {row: 5, column: 6},
            {row: 5, column: 5},
            {row: 4, column: 5},
        ]

        const other_element_pos: Position = {
            row: 7, column: 6
        }

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        /* 
        TEST WITH other element: Earth
        */
        const earth: Earth = new Earth();
        earth.updatePosition(other_element_pos);
        grid.updateGridCell(earth); 

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        /* 
        TEST WITH other element: Water
        */
        const water: Water = new Water();
        water.updatePosition(other_element_pos);
        grid.updateGridCell(water); 

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        /* 
        TEST WITH other element: Wind
        */
        const wind: Wind = new Wind();
        wind.updatePosition(other_element_pos);
        grid.updateGridCell(water); 

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        /* 
        TEST WITH other element: Sage
        */
        const sage: Sage = new Sage();
        sage.updatePosition(other_element_pos);
        grid.updateGridCell(water); 

        expect(() => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
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
        const grid: Grid = new Grid(10, 8);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 9},
            {row: 2, column: 9},
        ]
        const placed_water_pos: Position = {
            row: 4, column: 9
        }
        const new_water_sequence: Array<Position> = [
            {row: 5, column: 9},
            {row: 6, column: 9},
            {row: 6, column: 10}
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        expect( () => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
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
        const grid: Grid = new Grid(10, 8);
        const water_pos_list: Array<Position> = [
            {row: 3, column: 9},
            {row: 1, column: 9},
        ]
        const placed_water_pos: Position = {
            row: 4, column: 9
        }
        const new_water_sequence: Array<Position> = [
            {row: 4, column: 8},
            {row: 4, column: 7},
            {row: 4, column: 5}
        ]

        // Prepare grid
        water_pos_list.forEach((water_pos) => {
            const water: Water = new Water();
            water.updatePosition(water_pos);
            grid.updateGridCell(water);
        })

        // Place water
        const placed_water: Water = new Water();
        placed_water.updatePosition(placed_water_pos);
        grid.updateGridCell(placed_water);

        // Perform water reaction
        expect( () => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("New river data provided is invalid");

        // Fix new river
        new_water_sequence[2].column = 6;

        expect( () => {
            placed_water.reaction(grid, placed_water_pos, water_pos_list, new_water_sequence);
        }).toThrow("River data provided is invalid");

    })

})
  