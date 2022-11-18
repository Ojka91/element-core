import Board from "../board";
import { ElementTypes } from "../elements/elements";
import Grid, { Position } from "../grid";
import { Empty } from "../pieces";
import Player from "../player";



describe('Board', () => {
    it('generateInitialGrid: ensure the Board has the correct dimensions ', async () => {
        let board = new Board();
        let grid = board.getGrid();
        const num_rows = grid.getWidth();
        const num_columns = grid.getHeight();
        
        expect(num_rows == 11).toBe(true);
        expect(num_columns == 11).toBe(true);
    })
})

    /*it('generateInitialGrid: ensure the Board is initialized with empty pieces ', async () => {
        let board = new Board();
        let grid = board.getGrid();
        
        for (let row = 0; row < grid.getWidth(); row++){
            for (let column = 0; column < grid.getHeight(); column++){
                const position: Position = {row: row, column: column};
                expect(grid.getGridCellByPosition(position) instanceof Empty).toBe(true);
            }
        }
    })

    it('placePlayerSage: a legal player sage is placed in the grid', async () => {
        let board = new Board();
        let player = new Player(0);
        let grid = board.getGrid();

        const new_position: Position = {row: 5, column: 4}; // Orthogonally move to left
        board.placePlayerSage(player, new_position);

        expect(player.getSage()).toStrictEqual(grid.getGridCellByPosition(new_position));
    })

    it('placePlayerSage: an illegal player sage is placed in the grid', async () => {
        let board = new Board();
        let player = new Player(0);

        const new_position: Position = {row: 1, column: 4}; // Orthogonally move to left
        expect(() => {board.placePlayerSage(player, new_position);}).toThrow("Sage movement is not valid");
    })

    it('placePlayerSage: player sage is placed outside the grid boundaries', async () => {
        let board = new Board();
        let player = new Player(0);

        const new_position: Position = {row: 100, column: 4}; // Orthogonally move to left
        expect(() => {board.placePlayerSage(player, new_position);}).toThrow("Incorrect new row or new column dimensions");
    })

    it('getGrid: must return a grid object', async () => {
        let board = new Board();
        expect(board.getGrid() instanceof Grid).toBe(true);
    })

    it('getElementFromPool & returnElementToPool: it should add/remove the element to/off the pool', async () => {
        let board = new Board();
        board.getElementFromPool(ElementTypes.Fire);
        expect(board.elementPool.fire.amount == 29).toBe(true);
        board.returnElementToPool(ElementTypes.Fire);
        expect(board.elementPool.fire.amount == 30).toBe(true);
    })*/