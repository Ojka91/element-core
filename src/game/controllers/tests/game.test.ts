import { BoardModel } from "@/game/models/board";
import { ElementTypes } from "@/game/models/elements/elements";
import { GameModel, GameStates, GameType } from "@/game/models/game"
import { SageModel } from "@/game/models/pieces/sage";
import { SagePieceCreator } from "@/game/models/pieces_factory";
import { PlayerModel } from "@/game/models/player";
import { TurnStates } from "@/game/models/turn";
import { Position } from "@/game/utils/position_utils";
import BoardController from "../board_controller";
import { GameController } from "../game_controller";
import { TurnController } from "../turn_controller";

describe('GameController', () => {

    it('addPlayer: adds a player to the player list', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        const player: PlayerModel = new PlayerModel(0);

        game_controller.addPlayer(player);

        expect(game.player_list.includes(player)).toBe(true);
    })

    it('setupGame: sets up the game by the game type', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        const player0: PlayerModel = new PlayerModel(0);
        const player1: PlayerModel = new PlayerModel(1);

        game_controller.addPlayer(player0);
        game_controller.addPlayer(player1);

        game_controller.setupGame(GameType.TwoPlayersGame);

        expect(game.state == GameStates.GameRunning).toBe(true);
        expect(game.game_type == GameType.TwoPlayersGame).toBe(true);

    })

    it('drawingElements: drawing elements action controlled', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        let elements: Array<ElementTypes> = [ElementTypes.Fire, ElementTypes.Water];

        game.state = GameStates.NewGame;
        expect(() => game_controller.drawingElements(elements)).toThrow("Cannot draw elements if the game hadn't started or has ended");

        game.state = GameStates.EndGame;
        expect(() => game_controller.drawingElements(elements)).toThrow("Cannot draw elements if the game hadn't started or has ended");

        game.state = GameStates.GameRunning;
        game.turn.state = TurnStates.MovesAvailables;
        expect(() => game_controller.drawingElements(elements)).toThrow("Drawing elements is only allowed at the start of the turn");

        game.turn.state = TurnStates.DrawingElements;

        elements = [ElementTypes.Fire, ElementTypes.Water, ElementTypes.Fire, ElementTypes.Water, ElementTypes.Fire, ElementTypes.Water];
        expect(() => game_controller.drawingElements(elements)).toThrow("Maximum number of allowed elements to be requested have been exceded");

        elements = [ElementTypes.Fire, ElementTypes.Water];
        
        game.board.elementPool.fire.amount = 0;
        expect(() => game_controller.drawingElements(elements)).toThrow("Requested elements cannot be taken from the pool");

        game.board.elementPool.fire.amount = 10;
        game_controller.drawingElements(elements);

        expect(game.turn.chosen_elements).toStrictEqual(elements);

    })

    it('placeElement: place element on the board', async () => {
    
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        let elements: Array<ElementTypes> = [ElementTypes.Fire, ElementTypes.Water, ElementTypes.Earth];

        const player0: PlayerModel = new PlayerModel(0);
        const player1: PlayerModel = new PlayerModel(1);

        game_controller.addPlayer(player0);
        game_controller.addPlayer(player1);

        game_controller.setupGame(GameType.TwoPlayersGame);
        
        // Game set
        const piece_pos: Position = {row: 0, column: 0};

        game.state = GameStates.EndGame;
        expect(() => game_controller.placeElement(elements[0], piece_pos)).toThrow("Placing element is not allowed in the current game state");
        
        game.state = GameStates.GameRunning;
        game.turn.state = TurnStates.EndTurn;
        expect(() => game_controller.placeElement(elements[0], piece_pos)).toThrow("No more available elements to be placed");
        
        game.turn.state = TurnStates.DrawingElements;

        game_controller.drawingElements(elements);

        expect(() => game_controller.placeElement(ElementTypes.Wind , piece_pos)).toThrow("The element is not from the Drawn elements");

        game_controller.placeElement(elements[0], piece_pos);
        jest.restoreAllMocks();

        jest.spyOn(TurnController.prototype, 'isEndOfTurn').mockImplementation(() => false);
        game_controller.placeElement(elements[0], piece_pos);
        expect(game.turn.player).toStrictEqual(0);

        jest.restoreAllMocks();
        
        jest.spyOn(TurnController.prototype, 'isEndOfTurn').mockImplementation(() => true);
        game_controller.placeElement(elements[0], piece_pos);
        expect(game.turn.player).toStrictEqual(1);
        jest.restoreAllMocks();

        elements = [ElementTypes.Wind, ElementTypes.Fire, ElementTypes.Water];
        jest.spyOn(TurnController.prototype, 'isEndOfTurn').mockImplementation(() => true);
        game_controller.drawingElements(elements);
        game_controller.placeElement(elements[0], piece_pos);
        expect(game.turn.player).toStrictEqual(0);
        jest.restoreAllMocks();
    })

    it('movePlayerSage: move the sage around the board', async () => {
    
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        const player0: PlayerModel = new PlayerModel(0);
        const player1: PlayerModel = new PlayerModel(1);

        game_controller.addPlayer(player0);
        game_controller.addPlayer(player1);

        game_controller.setupGame(GameType.TwoPlayersGame);
        
        // Game set
        let sage_pos: Position = { row: 3, column: 5 };

        game.state = GameStates.EndGame;
        expect(() => game_controller.movePlayerSage(player0.uuid, sage_pos)).toThrow("Moving sage is not allowed in the current game state");
        
        game.state = GameStates.GameRunning;
        game.turn.state = TurnStates.MovesAvailables;
        game.turn.available_sage_moves = 0;
        expect(() => game_controller.movePlayerSage(player0.uuid, sage_pos)).toThrow("Cannot move sage, not available moves to spend");

        game.turn.available_sage_moves = 2;
        jest.spyOn(TurnController.prototype, 'isEndOfTurn').mockImplementation(() => false);
        game_controller.movePlayerSage(player0.uuid, sage_pos);
        expect(game.turn.player).toStrictEqual(0);
        jest.restoreAllMocks();

        sage_pos = { row: 4, column: 5 };
        game.turn.available_sage_moves = 1;
        jest.spyOn(TurnController.prototype, 'isEndOfTurn').mockImplementation(() => true);
        game_controller.movePlayerSage(player0.uuid, sage_pos);
        expect(game.turn.player).toStrictEqual(1);
        jest.restoreAllMocks();

    })

    it('endOfPlayerTurn: turn shall finish', async () => {
    
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        game.turn.chosen_elements = [ElementTypes.Fire, ElementTypes.Water, ElementTypes.Earth];

        const player0: PlayerModel = new PlayerModel(0);
        const player1: PlayerModel = new PlayerModel(1);

        game_controller.addPlayer(player0);
        game_controller.addPlayer(player1);

        game_controller.setupGame(GameType.TwoPlayersGame);
        
        // Game set
        jest.spyOn(BoardController.prototype, 'returnElementToPool').mockImplementation(() => null);
        game_controller.endOfPlayerTurn();
        expect(game.turn.player).toStrictEqual(1);
        jest.restoreAllMocks();
    })

    it('getBoard: shall return the board model', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);
        
        expect(game_controller.getBoard() instanceof BoardModel).toBe(true);
    })

    it('getTurnPlayer: shall return player model turn', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        const player0: PlayerModel = new PlayerModel(0);
        const player1: PlayerModel = new PlayerModel(1);

        game_controller.addPlayer(player0);
        game_controller.addPlayer(player1);
        
        expect(game_controller.getTurnPlayer()).toStrictEqual(player0);
    })

    it('getGameState: shall return the game state', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);
        
        expect(game_controller.getGameState()).toStrictEqual(GameStates.NewGame);
    })

    it('getWinner: shall return the winner player number if game is over', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);
        
        const player0: PlayerModel = new PlayerModel(0);
        player0.sage = new SagePieceCreator().createPieceModel() as SageModel;

        game_controller.addPlayer(player0);

        game.loser_uuid = "";
        expect(game_controller.getWinner()).toStrictEqual(null);

        game.loser_uuid = player0.sage.uuid;
        expect(game_controller.getWinner()).toStrictEqual(player0.uuid);
    })

    it('getPlayerById: shall return a player model of the Id or throw error if do not exist', async () => {
        const game: GameModel = new GameModel();
        const game_controller: GameController = new GameController(game);

        const player: PlayerModel = new PlayerModel(0);

        expect(() => game_controller.getPlayerById(player.uuid)).toThrow("Player Id not found")
        game_controller.addPlayer(player);
        expect(game_controller.getPlayerById(player.uuid)).toStrictEqual(player);
    })
})