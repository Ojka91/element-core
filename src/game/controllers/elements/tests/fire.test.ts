import { EarthModel } from "@/game/models/elements/earth";
import { FireModel } from "@/game/models/elements/fire";
import { WaterModel } from "@/game/models/elements/water";
import { WindModel } from "@/game/models/elements/wind";
import { ElementPoolManagerModel } from "@/game/models/element_pool";
import { GridModel } from "@/game/models/grid";
import { Position } from "@/game/utils/position_utils";
import GridController from "../../grid_controller";
import { FireController } from "../fire_controller";
import { WindController } from "../wind_controller";

describe('FireModelController: ruleOfReplacement', () => {
   let result;
   it('Rule of replacement: Should return true if replaces wind', async () => {
      const fire = new FireModel()

      const wind = new WindModel();
      result = new FireController(fire).ruleOfReplacement(wind);

      expect(result).toBe(true)
   })

   it('Rule of replacement: Should return false if replaces everything else', async () => {
      const fire = new FireModel();
      const earth = new EarthModel()
      const water = new WaterModel();
      const fire_2 = new FireModel();
      const whirlwind = new WindModel();
      new WindController(whirlwind).increaseStackedWinds();

      // Shouldn't replace earth
      result = new FireController(fire).ruleOfReplacement(earth)
      expect(result).toBe(false);
      // Shoudln't replace water
      result = new FireController(fire).ruleOfReplacement(water)
      expect(result).toBe(false);
      // Cannot stack neither replace fire over fire
      result = new FireController(fire).ruleOfReplacement(fire_2);
      expect(result).toBe(false);
      // shouldn't replace whirlwind
      result = new FireController(fire).ruleOfReplacement(whirlwind);
      expect(result).toBe(false);

   })
})

describe('FireModelController: reaction', () => {
   it('Reaction: Should propagate free fire orthogonally left', async () => {
      /* Orthogonally left propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire).place(grid, f_pos);

      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(true);

      expect(grid_controller.isPositionEmpty(empty_pos)).toBe(true);

   })

   it('Reaction: Should propagate free fire orthogonally right', async () => {
      /* Orthogonally left propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire_1: FireModel = new FireModel();
      const fire_2: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire_1).place(grid, f_pos_1);
      new FireController(fire_2).place(grid, f_pos_2);

      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(true);

   })

   it('Reaction: Should propagate free fire orthogonally up', async () => {
      /* Orthogonally up propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire_1: FireModel = new FireModel();
      const fire_2: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire_1).place(grid, f_pos_1);
      new FireController(fire_2).place(grid, f_pos_2);

      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(true);

   })

   it('Reaction: Should propagate free fire orthogonally down', async () => {
      /* Orthogonally down propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire_1: FireModel = new FireModel();
      const fire_2: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire_1).place(grid, f_pos_1);
      new FireController(fire_2).place(grid, f_pos_2);

      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(true);
   })

   it('Reaction: Should not propagate free fire diagonally', async () => {
      /* Orthogonally down propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire_1: FireModel = new FireModel();
      const fire_2: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire_1).place(grid, f_pos_1);
      new FireController(fire_2).place(grid, f_pos_2);


      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(false);
   })

   it('Reaction: Should not propagate outside grid boundaries', async () => {
      /* Orthogonally left propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire_1: FireModel = new FireModel();
      const fire_2: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire_1).place(grid, f_pos_1);
      new FireController(fire_2).place(grid, f_pos_2);


      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(false);

   })

   it('Reaction: Should propagate free fire orthogonally in all directions', async () => {
      /* Orthogonally up propagation 
          PF: Place fire
          F: FireModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire_1: FireModel = new FireModel();
      const fire_2: FireModel = new FireModel();
      const fire_3: FireModel = new FireModel();
      const fire_4: FireModel = new FireModel();
      const fire_5: FireModel = new FireModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire_1).place(grid, f_pos_1);
      new FireController(fire_2).place(grid, f_pos_2);
      new FireController(fire_3).place(grid, f_pos_3);
      new FireController(fire_4).place(grid, f_pos_4);
      new FireController(fire_5).place(grid, f_pos_5);


      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos_1)).toBe(true);
      expect(grid_controller.isFireCell(ff_pos_2)).toBe(true);
      expect(grid_controller.isFireCell(ff_pos_3)).toBe(true);
      expect(grid_controller.isFireCell(ff_pos_4)).toBe(true);

   })

   it('Reaction: Should propagate free fire over wind', async () => {
      /* Orthogonally up propagation 
          PF: Place fire
          F: FireModel
          FF: Free fire
          W: WindModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire: FireModel = new FireModel();
      const wind: WindModel = new WindModel();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire).place(grid, f_pos);
      new WindController(wind).place(grid, w_pos);





      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(true);

   })

   it('Reaction: Should not propagate free fire over whirlwind', async () => {
      /* Orthogonally up propagation 
          PF: Place fire
          F: FireModel
          FF: Free fire
          W: WindModel
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire: FireModel = new FireModel();
      const wind: WindModel = new WindModel();
      new WindController(wind).increaseStackedWinds();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire).place(grid, f_pos);
      new WindController(wind).place(grid, w_pos);


      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(false);

   })

   it('Reaction: Should not propagate free fire if element pool is empty', async () => {
      /* Orthogonally up propagation 
          PF: Place fire
          F: FireModel
          FF: Free fire
          W: WindModel
           0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   |   |   |   |   |   |   |   |   | <-- Should NOT be replaced!
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
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

      const placed_fire: FireModel = new FireModel();
      const fire: FireModel = new FireModel();
      const wind: WindModel = new WindModel();
      new WindController(wind).increaseStackedWinds();

      new FireController(placed_fire).place(grid, pf_pos);
      new FireController(fire).place(grid, f_pos);
      new WindController(wind).place(grid, w_pos);

      element_pool_manager.fire.amount = 0;

      new FireController(placed_fire).reaction(grid, pf_pos, element_pool_manager);

      expect(grid_controller.isFireCell(ff_pos)).toBe(false);

   })

   it('Reaction: must throw error if no element pool is passed', async () => {
      /* Orthogonally up propagation 
          PF: Place fire
          F: FireModel
          FF: Free fire
          W: WindModel
           0   1   2   3   4   5   6   7   8   9 
         -----------------------------------------
      0  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      1  |   |   |   |   |   |   |   |   |   |   |
         -----------------------------------------
      2  |   |   |   |   |   |   |   |   |   |   | <-- Should NOT be replaced!
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
      const grid: GridModel = new GridModel();
      const grid_controller: GridController = new GridController(grid);
      grid_controller.generateInitialGrid(10, 8);
      const element_pool_manager: ElementPoolManagerModel = new ElementPoolManagerModel();
      const pf_pos: Position = {
         row: 4,
         column: 3
      }
      const placed_fire: FireModel = new FireModel();

      expect(() => {
         new FireController(placed_fire).reaction(grid, pf_pos);
      }).toThrow("Element pool is required for Fire reaction")

   })
})
