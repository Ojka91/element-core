import Board from "../board";
import { Grid, Position } from "../grid"
import { isSageMoveValid } from "../movement_manager";
import { SagePieceCreator } from "../pieces_factory";

// Given initial Sage position for 2 players which is {row: 4, column: 5}
const allowedSageMoves: Position[] = [
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

const illegalSageMoves: Position[] = [
    // Illegal orthogonal moves
    {row: 2, column: 5},
    {row: 4, column: 5},
    {row: 4, column: 7},
    {row: 4, column: 3},
    // Illegal diagonal moves
    {row: 2, column: 2} 
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
        const cur_pos: Position = {row: 4, column: 5};
        let grid: Grid = new Board().getGrid();
        let result;
        for (let new_pos of allowedSageMoves){
            result = isSageMoveValid(grid, cur_pos, new_pos);
            expect(result).toBe(true);
        }
    })

    it('isSageMoveValid: should return false for all illegal movements ', async () => {
        const cur_pos: Position = {row: 4, column: 5};
        let grid: Grid = new Board().getGrid();
        let result;
        for (let new_pos of illegalSageMoves){
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
})