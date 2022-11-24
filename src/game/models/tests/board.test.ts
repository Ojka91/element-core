import { WaterReaction } from "@/schemas/player_actions";
import Board from "../board";
import { ElementTypes } from "../elements/elements";
import { GameType } from "../game_utils";
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

    it('generateInitialGrid: ensure the Board is initialized with empty pieces ', async () => {
        let board = new Board();
        let grid = board.getGrid();

        for (let row = 0; row < grid.getWidth(); row++) {
            for (let column = 0; column < grid.getHeight(); column++) {
                const position: Position = { row: row, column: column };
                expect(grid.getGridCellByPosition(position) instanceof Empty).toBe(true);
            }
        }
    })

    it('placePlayerSage: a legal player sage is placed in the grid', async () => {
        let board = new Board();
        let player = new Player(0);
        let grid = board.getGrid();
        board.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);

        const new_position: Position = { row: 2, column: 1 }; // Orthogonally move to left
        board.placePlayerSage(player, new_position);

        expect(player.getSage()).toStrictEqual(grid.getGridCellByPosition(new_position));
    })

    it('placePlayerSage: an illegal player sage is placed in the grid', async () => {
        let board = new Board();
        let player = new Player(0);
        board.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);

        const new_position: Position = { row: 1, column: 4 };
        expect(() => { board.placePlayerSage(player, new_position); }).toThrow("Sage movement is not valid");
    })

    it('placePlayerSage: player sage is placed outside the grid boundaries', async () => {
        let board = new Board();
        let player = new Player(0);
        board.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);

        const new_position: Position = { row: 100, column: 4 }; // Orthogonally move to left
        expect(() => { board.placePlayerSage(player, new_position); }).toThrow("Incorrect new row or new column dimensions");
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
    })

    it('placeElement: it should place an element into the board', async () => {
        let board = new Board();
        const pos: Position = {
            row: 0,
            column: 0
        }

        const pos2: Position = {
            row: 111,
            column: 0
        }

        expect(board.placeElement(ElementTypes.Fire, pos) == null).toBe(true);
        expect(() => { board.placeElement(ElementTypes.Earth, pos); }).toThrow("Cannot replace the cell due to a rule of replacement");
        expect(board.placeElement(ElementTypes.Water, pos) == null).toBe(true);
        expect(board.placeElement(ElementTypes.Earth, pos) == null).toBe(true);
        expect(board.placeElement(ElementTypes.Wind, pos) == null).toBe(true);
        expect(() => { board.placeElement(ElementTypes.Earth, pos2); }).toThrow("Invalid position, outside grid boundaries");

    })

    it('performElementReaction: it should react to a water element next to a river', async () => {
        let board = new Board();
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }
        const river: Array<Position> = [
            pos1
        ]

        const new_river: Array<Position> = [
            { row: 0, column: 2 },
            { row: 0, column: 3 }
        ]

        const reaction: WaterReaction = new WaterReaction(river, new_river);

        expect(board.placeElement(ElementTypes.Water, pos1) == null).toBe(true);
        expect(board.performElementReaction(ElementTypes.Water, pos1, reaction) == null).toBe(true);
        expect(board.placeElement(ElementTypes.Water, pos2) == null).toBe(true);
        expect(board.performElementReaction(ElementTypes.Water, pos2, reaction) == null).toBe(true);
        //expect(() => {board.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");

    })

    it('performElementReaction: it should react to a fire element next to another fire', async () => {
        let board = new Board();
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }

        expect(board.placeElement(ElementTypes.Fire, pos1) == null).toBe(true);
        expect(board.placeElement(ElementTypes.Fire, pos2) == null).toBe(true);
        expect(board.performElementReaction(ElementTypes.Fire, pos1) == null).toBe(true);
        //expect(() => {board.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");

    })

    it('performElementReaction: it should react to earth elements', async () => {
        let board = new Board();
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }

        expect(board.placeElement(ElementTypes.Earth, pos1) == null).toBe(true);
        expect(board.placeElement(ElementTypes.Earth, pos2) == null).toBe(true);
        expect(board.performElementReaction(ElementTypes.Earth, pos1) == null).toBe(true);
        //expect(() => {board.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");
    })

    it('performElementReaction: it should react to wind elements', async () => {
        let board = new Board();
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }

        expect(board.placeElement(ElementTypes.Wind, pos1) == null).toBe(true);
        expect(board.placeElement(ElementTypes.Wind, pos2) == null).toBe(true);
        expect(board.performElementReaction(ElementTypes.Wind, pos1) == null).toBe(true);
        //expect(() => {board.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");
    })
})