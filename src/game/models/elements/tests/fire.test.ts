import Grid, { Position } from "../../grid";
import { Earth } from "../earth";
import { ElementTypes } from "../elements"
import { ElementFactoryMap } from "../elements_factory"
import { Fire } from "../fire"
import { Water } from "../water";
import { Wind } from "../wind";


describe('Fire: ruleOfReplacement', () => {
    let result;
    it('Rule of replacement: Should return true if replaces wind', async () => {
        const fire = new Fire()
        
        const wind = new Wind();
        result = fire.ruleOfReplacement(wind);

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces everything else', async () => {
        const fire = new Fire();
        const earth = new Earth()
        const water = new Water();
        const fire_2 = new Fire();
        const whirlwind = new Wind();
        whirlwind.increaseStackedWinds();
        
        // Shouldn't replace earth
        result = fire.ruleOfReplacement(earth)
        expect(result).toBe(false);
        // Shoudln't replace water
        result = fire.ruleOfReplacement(water)
        expect(result).toBe(false);
        // Cannot stack neither replace fire over fire
        result = fire.ruleOfReplacement(fire_2);
        expect(result).toBe(false);
        // shouldn't replace whirlwind
        result = fire.ruleOfReplacement(whirlwind);
        expect(result).toBe(false);
        
    })
})

describe('Fire: reaction', () => {
    it('Reaction: Should propagate free fire orthogonally left', async () => {
        /* Orthogonally left propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        3  |   |   | FF| F | PF|   |   |   |   |   |
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
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 3,
        column: 4
       }
       const f_pos: Position = {
        row: 3,
        column: 3
       }
       const ff_pos: Position = {
        row: 3,
        column: 2
       }
       const empty_pos: Position = {
        row: 3,
        column: 1
       }

       const placed_fire: Fire = new Fire();
       const fire: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire.updatePosition(f_pos);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(true);

       expect(grid.isPositionEmpty(empty_pos)).toBe(true);
    
    })

    it('Reaction: Should propagate free fire orthogonally right', async () => {
        /* Orthogonally left propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        3  |   |   | PF| F | F | FF|   |   |   |   |
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
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 3,
        column: 2
       }
       const f_pos_1: Position = {
        row: 3,
        column: 3
       }
       const f_pos_2: Position = {
        row: 3,
        column: 4
       }
       const ff_pos: Position = {
        row: 3,
        column: 5
       }

       const placed_fire: Fire = new Fire();
       const fire_1: Fire = new Fire();
       const fire_2: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire_1.updatePosition(f_pos_1);
       fire_2.updatePosition(f_pos_2);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire_1);
       grid.updateGridCell(fire_2);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(true);
    
    })

    it('Reaction: Should propagate free fire orthogonally up', async () => {
        /* Orthogonally up propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   | FF|   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        3  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        4  |   |   |   | PF|   |   |   |   |   |   |
           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        */
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 4,
        column: 3
       }
       const f_pos_1: Position = {
        row: 3,
        column: 3
       }
       const f_pos_2: Position = {
        row: 2,
        column: 3
       }
       const ff_pos: Position = {
        row: 1,
        column: 3
       }

       const placed_fire: Fire = new Fire();
       const fire_1: Fire = new Fire();
       const fire_2: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire_1.updatePosition(f_pos_1);
       fire_2.updatePosition(f_pos_2);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire_1);
       grid.updateGridCell(fire_2);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(true);
    
    })

    it('Reaction: Should propagate free fire orthogonally down', async () => {
        /* Orthogonally down propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   | PF|   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        3  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        4  |   |   |   | FF|   |   |   |   |   |   |
           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        */
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 1,
        column: 3
       }
       const f_pos_1: Position = {
        row: 2,
        column: 3
       }
       const f_pos_2: Position = {
        row: 3,
        column: 3
       }
       const ff_pos: Position = {
        row: 4,
        column: 3
       }

       const placed_fire: Fire = new Fire();
       const fire_1: Fire = new Fire();
       const fire_2: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire_1.updatePosition(f_pos_1);
       fire_2.updatePosition(f_pos_2);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire_1);
       grid.updateGridCell(fire_2);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(true);
    })

    it('Reaction: Should not propagate free fire diagonally', async () => {
        /* Orthogonally down propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   | PF|   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   |   | F |   |   |   |   |   |
           -----------------------------------------
        3  |   |   |   |   |   | F |   |   |   |   |
           -----------------------------------------
        4  |   |   |   |   |   |   | FF|   |   |   | <-- Wrong!
           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        */
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 1,
        column: 3
       }
       const f_pos_1: Position = {
        row: 2,
        column: 4
       }
       const f_pos_2: Position = {
        row: 3,
        column: 5
       }
       const ff_pos: Position = {
        row: 4,
        column: 6
       }

       const placed_fire: Fire = new Fire();
       const fire_1: Fire = new Fire();
       const fire_2: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire_1.updatePosition(f_pos_1);
       fire_2.updatePosition(f_pos_2);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire_1);
       grid.updateGridCell(fire_2);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(false);
    })

    it('Reaction: Should not propagate outside grid boundaries', async () => {
        /* Orthogonally left propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        3  |   |   |   |   |   |   |   | PF| F | F | FF <-- Wrong!
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
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 3,
        column: 7
       }
       const f_pos_1: Position = {
        row: 3,
        column: 8
       }
       const f_pos_2: Position = {
        row: 3,
        column: 9
       }
       const ff_pos: Position = {
        row: 3,
        column: 10
       }

       const placed_fire: Fire = new Fire();
       const fire_1: Fire = new Fire();
       const fire_2: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire_1.updatePosition(f_pos_1);
       fire_2.updatePosition(f_pos_2);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire_1);
       grid.updateGridCell(fire_2);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(false);
    
    })

    it('Reaction: Should propagate free fire orthogonally in all directions', async () => {
        /* Orthogonally up propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   | FF|   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        3  | FF| F | F | PF| F | FF |   |   |   |   |
           -----------------------------------------
        4  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        5  |   |   |   | FF |   |   |   |   |   |   |
           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        */
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 3,
        column: 3
       }
       const f_pos_1: Position = {
        row: 2,
        column: 3
       }
       const f_pos_2: Position = {
        row: 3,
        column: 4
       }
       const f_pos_3: Position = {
        row: 4,
        column: 3
       }
       const f_pos_4: Position = {
        row: 3,
        column: 2
       }
       const f_pos_5: Position = {
        row: 3,
        column: 1
       }
       const ff_pos_1: Position = {
        row: 1,
        column: 3
       }
       const ff_pos_2: Position = {
        row: 3,
        column: 5
       }
       const ff_pos_3: Position = {
        row: 5,
        column: 3
       }
       const ff_pos_4: Position = {
        row: 3,
        column: 0
       }

       const placed_fire: Fire = new Fire();
       const fire_1: Fire = new Fire();
       const fire_2: Fire = new Fire();
       const fire_3: Fire = new Fire();
       const fire_4: Fire = new Fire();
       const fire_5: Fire = new Fire();

       placed_fire.updatePosition(pf_pos);
       fire_1.updatePosition(f_pos_1);
       fire_2.updatePosition(f_pos_2);
       fire_3.updatePosition(f_pos_3);
       fire_4.updatePosition(f_pos_4);
       fire_5.updatePosition(f_pos_5);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire_1);
       grid.updateGridCell(fire_2);
       grid.updateGridCell(fire_3);
       grid.updateGridCell(fire_4);
       grid.updateGridCell(fire_5);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos_1)).toBe(true);
       expect(grid.isFireCell(ff_pos_2)).toBe(true);
       expect(grid.isFireCell(ff_pos_3)).toBe(true);
       expect(grid.isFireCell(ff_pos_4)).toBe(true);
    
    })

    it('Reaction: Should propagate free fire over wind', async () => {
        /* Orthogonally up propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
            W: Wind
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   | W |   |   |   |   |   |   | <-- Should be replaced!
           -----------------------------------------
        3  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        4  |   |   |   | PF|   |   |   |   |   |   |
           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        */
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 4,
        column: 3
       }
       const f_pos: Position = {
        row: 3,
        column: 3
       }
       const w_pos: Position = {
        row: 2,
        column: 3
       }
       const ff_pos: Position = w_pos;

       const placed_fire: Fire = new Fire();
       const fire: Fire = new Fire();
       const wind: Wind = new Wind();

       placed_fire.updatePosition(pf_pos);
       fire.updatePosition(f_pos);
       wind.updatePosition(w_pos);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire);
       grid.updateGridCell(wind);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(true);
    
    })

    it('Reaction: Should not propagate free fire over whirlwind', async () => {
        /* Orthogonally up propagation 
            PF: Place fire
            F: Fire
            FF: Free fire
            W: Wind
             0   1   2   3   4   5   6   7   8   9 
           -----------------------------------------
        0  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        1  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        2  |   |   |   | WL|   |   |   |   |   |   | <-- Should NOT be replaced!
           -----------------------------------------
        3  |   |   |   | F |   |   |   |   |   |   |
           -----------------------------------------
        4  |   |   |   | PF|   |   |   |   |   |   |
           -----------------------------------------
        5  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        6  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        7  |   |   |   |   |   |   |   |   |   |   |
           -----------------------------------------
        */
       const grid: Grid = new Grid(10, 8);
       const pf_pos: Position = {
        row: 4,
        column: 3
       }
       const f_pos: Position = {
        row: 3,
        column: 3
       }
       const w_pos: Position = {
        row: 2,
        column: 3
       }
       const ff_pos: Position = w_pos;

       const placed_fire: Fire = new Fire();
       const fire: Fire = new Fire();
       const wind: Wind = new Wind();
       wind.increaseStackedWinds();

       placed_fire.updatePosition(pf_pos);
       fire.updatePosition(f_pos);
       wind.updatePosition(w_pos);

       grid.updateGridCell(placed_fire);
       grid.updateGridCell(fire);
       grid.updateGridCell(wind);
       
       placed_fire.reaction(grid, pf_pos);

       expect(grid.isFireCell(ff_pos)).toBe(false);
    
    })
})
  