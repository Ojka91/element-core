import { BoardModel } from "@/game/models/board";
import { EarthModel } from "@/game/models/elements/earth";
import { ElementTypes } from "@/game/models/elements/elements";
import { GameType } from "@/game/models/game";
import { GridModel } from "@/game/models/grid";
import { SageModel } from "@/game/models/pieces/sage";
import { PlayerModel } from "@/game/models/player";
import { Position } from "@/game/utils/position_utils";
import { WaterReaction } from "@/schemas/player_actions";
import BoardController from "../board_controller";
import { EarthController } from "../elements/earth_controller";
import GridController from "../grid_controller";
import { SageController } from "../pieces/sage_controller";

describe('BoardController', () => {

    it('placePlayerSage: a legal player sage is placed in the grid', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const player: PlayerModel = new PlayerModel(0);

        board_controller.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);

        const new_position: Position = { row: 2, column: 1 }; // Orthogonally move to left
        board_controller.placePlayerSage(player, new_position);

        expect(player.sage).toStrictEqual(grid_controller.getGridCellByPosition(new_position));
    })

    it('placePlayerSage: an illegal player sage is placed in the grid', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const player: PlayerModel = new PlayerModel(0);
        board_controller.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);

        const new_position: Position = { row: 1, column: 4 };
        expect(() => { board_controller.placePlayerSage(player, new_position); }).toThrow("Sage movement is not valid");
    })

    it('placePlayerSage: player sage is placed outside the grid boundaries', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const player: PlayerModel = new PlayerModel(0);
        board_controller.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);

        const new_position: Position = { row: 100, column: 4 }; // Orthogonally move to left
        expect(() => { board_controller.placePlayerSage(player, new_position); }).toThrow("Incorrect new row or new column dimensions");
    })

    it('getGrid: must return a grid object', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const player: PlayerModel = new PlayerModel(0);
        expect(board_controller.getGrid() instanceof GridModel).toBe(true);
    })

    it('getElementFromPool & returnElementToPool: it should add/remove the element to/off the pool', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        board_controller.getElementFromPool(ElementTypes.Fire);
        expect(board.elementPool.fire.amount == 29).toBe(true);
        board_controller.returnElementToPool(ElementTypes.Fire);
        expect(board.elementPool.fire.amount == 30).toBe(true);
    })

    it('placeElement: it should place an element into the board', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const pos: Position = {
            row: 0,
            column: 0
        }

        const pos2: Position = {
            row: 111,
            column: 0
        }

        expect(board_controller.placeElement(ElementTypes.Fire, pos) == null).toBe(true);
        expect(() => { board_controller.placeElement(ElementTypes.Earth, pos); }).toThrow("Cannot replace the cell due to a rule of replacement");
        expect(board_controller.placeElement(ElementTypes.Water, pos) == null).toBe(true);
        expect(board_controller.placeElement(ElementTypes.Earth, pos) == null).toBe(true);
        expect(board_controller.placeElement(ElementTypes.Wind, pos) == null).toBe(true);
        expect(() => { board_controller.placeElement(ElementTypes.Earth, pos2); }).toThrow("Invalid position, outside grid boundaries");

    })

    it('performElementReaction: it should react to a water element next to a river', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
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

        expect(board_controller.placeElement(ElementTypes.Water, pos1) == null).toBe(true);
        expect(board_controller.performElementReaction(ElementTypes.Water, pos1, reaction) == null).toBe(true);
        expect(board_controller.placeElement(ElementTypes.Water, pos2) == null).toBe(true);
        expect(board_controller.performElementReaction(ElementTypes.Water, pos2, reaction) == null).toBe(true);
        //expect(() => {board_controller.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");

    })

    it('performElementReaction: it should react to a fire element next to another fire', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }

        expect(board_controller.placeElement(ElementTypes.Fire, pos1) == null).toBe(true);
        expect(board_controller.placeElement(ElementTypes.Fire, pos2) == null).toBe(true);
        expect(board_controller.performElementReaction(ElementTypes.Fire, pos1) == null).toBe(true);
        //expect(() => {board_controller.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");

    })

    it('performElementReaction: it should react to earth elements', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }

        expect(board_controller.placeElement(ElementTypes.Earth, pos1) == null).toBe(true);
        expect(board_controller.placeElement(ElementTypes.Earth, pos2) == null).toBe(true);
        expect(board_controller.performElementReaction(ElementTypes.Earth, pos1) == null).toBe(true);
        //expect(() => {board_controller.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");
    })

    it('performElementReaction: it should react to wind elements', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const pos1: Position = {
            row: 0,
            column: 0
        }
        const pos2: Position = {
            row: 0,
            column: 1
        }

        expect(board_controller.placeElement(ElementTypes.Wind, pos1) == null).toBe(true);
        expect(board_controller.placeElement(ElementTypes.Wind, pos2) == null).toBe(true);
        expect(board_controller.performElementReaction(ElementTypes.Wind, pos1) == null).toBe(true);
        //expect(() => {board_controller.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");
    })

    it('performElementReaction: it should react to water elements', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5)
        
        const pos1: Position = {
            row: 0,
            column: 0
        }

        expect(board_controller.placeElement(ElementTypes.Water, pos1) == null).toBe(true);
        expect(board_controller.performElementReaction(ElementTypes.Water, pos1) == null).toBe(true);
        //expect(() => {board_controller.placeElement(ElementTypes.Earth, pos);}).toThrow("Cannot replace the cell due to a rule of replacement");
    })

    it('checkElementPoolAvailability: check it is being called', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
        
        const elements: Array<ElementTypes> = [ElementTypes.Water];
        
        board.elementPool.water.amount = 5;

        expect(board_controller.checkElementPoolAvailability(elements)).toBe(true);
    })

    it('displayGrid: check it is being called', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);

        expect(board_controller.displayGrid() == null).toBe(true);
    })

    it('winningCondition: check if placed piece is a winning condition. It return null if no winning condition or the uuid of the loser', async () => {
        const board: BoardModel = new BoardModel();
        const board_controller: BoardController = new BoardController(board);
    
        const player: PlayerModel = new PlayerModel(0);

        const grid_controller: GridController = new GridController(board.grid);
        grid_controller.generateInitialGrid(5,5);

        board_controller.createSageByPlayerAndGameType(player, GameType.FourPlayersGame);


        const sage: SageModel = new SageModel();
        
        const position: Position = {row: 1, column: 1};
        const placed_piece: Position = {row: 3, column: 3};
        
        // Fill grid with earths
        for (let row  = 1; row < 4; row++){
            for (let col = 1; col < 4; col++){
                new EarthController(new EarthModel()).place(board.grid, {row: row, column: col})
            }
        }

        grid_controller.clearCell(position);
        
        
        sage.position = position;
        grid_controller.updateGridCell(sage);
        
        expect(board_controller.winningCondition(position) == sage.uuid).toBe(true);
        
        grid_controller.clearCell(placed_piece);

        expect(board_controller.winningCondition(position) == null).toBe(false);

        
    })
})