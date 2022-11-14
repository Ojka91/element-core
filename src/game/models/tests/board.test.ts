import Board from "../board";
import { Position } from "../grid";
import { Empty } from "../pieces";
import Player, { GameType, PlayerNumber } from "../player";



describe('Board', () => {
    it('generateInitialGrid: ensure the Board has the correct dimensions ', async () => {
        let board = new Board();
        let grid = board.getGrid();
        const num_rows = grid.getWidth();
        const num_columns = grid.getHeight();
        
        expect(num_rows == 11).toBe(true);
        expect(num_columns == 11).toBe(true);
    });

    it('generateInitialGrid: ensure the Board is initialized with empty pieces ', async () => {
        let board = new Board();
        let grid = board.getGrid();
        
        for (let row = 0; row < grid.getWidth(); row++){
            for (let column = 0; column < grid.getHeight(); column++){
                const position: Position = {row: row, column: column};
                expect(grid.getGridCellByPosition(position) instanceof Empty).toBe(true);
            }
        }
    });

    it('placePlayerSage: a legal player sage is placed in the grid', async () => {
        let board = new Board();
        let player = new Player(PlayerNumber.player_1, GameType.TwoPlayersGame);
        let grid = board.getGrid();

        const new_position: Position = {row: 5, column: 4}; // Orthogonally move to left
        board.placePlayerSage(player, new_position);

        expect(player.getSage()).toStrictEqual(grid.getGridCellByPosition(new_position));
    });
})
  