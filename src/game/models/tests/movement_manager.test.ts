import Board from "../board";
import { Earth } from "../elements/earth";
import { ElementTypes } from "../elements/elements";
import { Wind } from "../elements/wind";
import { Grid, Position } from "../grid"
import { isSageMoveValid } from "../movement_manager";
import { ElementPieceCreator, SagePieceCreator } from "../pieces_factory";

const surroundingSageMoves: Position[] = [
    // Orthogonal moves
    {row: 3, column: 5}, // up
    {row: 5, column: 5}, // down
    {row: 4, column: 4}, // Right
    {row: 4, column: 6}, // Down
    // Diagonal moves
    {row: 3, column: 4}, // up-left
    {row: 3, column: 6}, // up-right
    {row: 5, column: 5}, // down-left
    {row: 5, column: 6}, // down-right
]

describe('movement_manager', () => {
    it('isSageMoveValid: should return false if there is no change in position ', async () => {
        const cur_pos: Position = {row: 0, column: 0};
        const new_pos: Position = {row: 0, column: 0};
        const board: Board = new Board();
        let grid: Grid = board.getGrid();

        const result = isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
    })

    it('isSageMoveValid: should return true for all allowed movements ', async () => {
        // Given initial Sage position for 2 players which is {row: 4, column: 5}
        const cur_pos: Position = {row: 4, column: 5};
        let grid: Grid = new Board().getGrid();
        let result;
        for (let new_pos of surroundingSageMoves){
            result = isSageMoveValid(grid, cur_pos, new_pos);
            expect(result).toBe(true);
        }
    })

    it('isSageMoveValid: should return false for all illegal movements ', async () => {
        
        const cur_pos: Position = {row: 4, column: 5};
        let grid: Grid = new Board().getGrid();
        let result;
        for (let new_pos of surroundingSageMoves){
            const earth = new ElementPieceCreator(ElementTypes.Earth).createPiece();
            earth.updatePosition(new_pos);
            grid.updateGridCell(earth);
            result = isSageMoveValid(grid, cur_pos, new_pos);
            expect(result).toBe(false);
        }
        
    })

    it('isSageMoveValid: should return false if the cell is not empty', async () => {
        const cur_pos: Position = {row: 4, column: 5};
        const new_pos: Position = {row: 5, column: 6};
        let grid: Grid = new Board().getGrid();
        
        let sage = new SagePieceCreator().createPiece();
        sage.updatePosition(new_pos);

        grid.updateGridCell(sage);
        
        const result = isSageMoveValid(grid, cur_pos, new_pos);
        expect(result).toBe(false);
        
    })

   it('isSageMoveValid: should return true upon wind jump', async () => {
        
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
      const cur_pos: Position = {row: 1, column: 1};
      const wind_pos: Position = {row: 2, column: 2};
      const new_pos: Position = {row: 3, column: 3};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      let result;

      wind.updatePosition(wind_pos);
      grid.updateGridCell(wind);
      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(true);
   })

   it('isSageMoveValid: should return false upon wind jump to a cell not in line with wind', async () => {
        
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
    const cur_pos: Position = {row: 1, column: 1};
    const wind_pos: Position = {row: 2, column: 2};
    const new_pos: Position = {row: 3, column: 2};
    let grid: Grid = new Board().getGrid();
 
    let wind = new Wind();
    let result;

    wind.updatePosition(wind_pos);
    grid.updateGridCell(wind);
    result = isSageMoveValid(grid, cur_pos, new_pos);
    expect(result).toBe(false);
 })

   it('isSageMoveValid: should return false jumping over a whirlwind less distance than stacked and true when jumping the correct distance', async () => {
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

      const cur_pos: Position = {row: 1, column: 1};
      const wind_pos: Position = {row: 2, column: 2};
      const new_pos: Position = {row: 3, column: 3};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      let result;
      wind.updatePosition(wind_pos);
      // convert wind to whirlwind
      wind.ruleOfReplacement(new Wind());
      grid.updateGridCell(wind);
      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(false);
      
      new_pos.row = 4;
      new_pos.column = 4;

      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(true);
   })

   it('isSageMoveValid: should return true jumping through a line of winds', async () => {
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
      const cur_pos: Position = {row: 1, column: 1};
      const wind_1_pos: Position = {row: 2, column: 2};
      const wind_2_pos: Position = {row: 3, column: 3};
      const new_pos: Position = {row: 4, column: 4};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      let result;
      wind.updatePosition(wind_1_pos);
      grid.updateGridCell(wind);
      wind = new Wind();
      wind.updatePosition(wind_2_pos);
      grid.updateGridCell(wind);

      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(true);
   })
   
   it('isSageMoveValid: should return false jumping outside boundaries', async () => {
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
      const cur_pos: Position = {row: 9, column: 9};
      const wind_pos: Position = {row: 10, column: 10};
      const new_pos: Position = {row: 11, column: 11};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      let result;

      wind.updatePosition(wind_pos);
      grid.updateGridCell(wind);

      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(false);
    })

    it('isSageMoveValid: should return true jumping over an element', async () => {
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
      const cur_pos: Position = {row: 2, column: 4};
      const wind_pos: Position = {row: 2, column: 5};
      const earth_pos: Position = {row: 2, column: 6};
      const new_pos: Position = {row: 2, column: 7};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      wind.ruleOfReplacement(new Wind());
      
      let earth = new Earth();
      let result;

      earth.updatePosition(earth_pos);
      grid.updateGridCell(earth);
      wind.updatePosition(wind_pos);
      grid.updateGridCell(wind);

      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(true);
    })

    it('isSageMoveValid: should return false jumping over a mountain', async () => {
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
      const cur_pos: Position = {row: 2, column: 4};
      const wind_pos: Position = {row: 2, column: 5};
      const earth_pos: Position = {row: 2, column: 6};
      const new_pos: Position = {row: 2, column: 7};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      wind.ruleOfReplacement(new Wind());
      
      let earth = new Earth();
      earth.ruleOfReplacement(new Earth());
      let result;

      earth.updatePosition(earth_pos);
      grid.updateGridCell(earth);
      wind.updatePosition(wind_pos);
      grid.updateGridCell(wind);

      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(false);
    })

    it('isSageMoveValid: should return false jumping over a range', async () => {
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
      const cur_pos: Position = {row: 3, column: 5};
      const wind_pos: Position = {row: 2, column: 5};
      const earth_pos: Position = {row: 1, column: 5};
      const mountain_pos: Position = {row: 2, column: 6};
      const new_pos: Position = {row: 0, column: 5};
      let grid: Grid = new Board().getGrid();
   
      let wind = new Wind();
      wind.ruleOfReplacement(new Wind());
      
      let earth = new Earth();
      let mountain = new Earth();
      mountain.ruleOfReplacement(new Earth());
      let result;

      earth.updatePosition(earth_pos);
      grid.updateGridCell(earth);
      mountain.updatePosition(mountain_pos);
      grid.updateGridCell(mountain);
      wind.updatePosition(wind_pos);
      grid.updateGridCell(wind);

      result = isSageMoveValid(grid, cur_pos, new_pos);
      expect(result).toBe(false);
    })
})