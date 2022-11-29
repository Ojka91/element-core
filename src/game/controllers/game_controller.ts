import { Reaction } from "@/schemas/player_actions";
import { BoardModel, IBoardModel } from "../models/board";
import { ElementTypes } from "../models/elements/elements";
import { GameModel, GameStates, IGameModel } from "../models/game";
import { IPlayerModel } from "../models/player";
import { TurnModel } from "../models/turn";
import { Position } from "../utils/position_utils";
import BoardController from "./board_controller";
import PlayerController from "./player_controller";
import { TurnController } from "./turn_controller";


export interface IGameController {
    addPlayer(player: IPlayerModel): void;
    setupGame(game_type: number): void;
    drawingElements(elements: Array<ElementTypes>): void;
    placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void;
    movePlayerSage(player: IPlayerModel, position: Position): void;
    endOfPlayerTurn(): void;
    getBoard(): IBoardModel;
    getTurnPlayer(): IPlayerModel;
    getGameState(): GameStates;
    getWinner(): number | null;
}

export class GameController implements IGameController {

    private model: GameModel;
    private board_controller: BoardController;
    private turn_controller: TurnController;

    constructor(model: IGameModel) {
        this.model = model;
        this.board_controller = new BoardController(this.model.board);
        this.turn_controller = new TurnController(this.model.turn);
    }

    public addPlayer(player: IPlayerModel): void {
        this.model.player_list.push(player);
    }

    public setupGame(game_type: number): void {
        // Resets the board
        this.model.board = new BoardModel();
        this.board_controller.initBoard();
        
        this.model.player_list.forEach((player) => {
            this.board_controller.createSageByPlayerAndGameType(player, game_type);
        })
        this.model.game_type = game_type;
        this.model.state = GameStates.GameRunning;
    }

    public drawingElements(elements: Array<ElementTypes>): void {

        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Cannot draw elements if the game hadn't started or has ended");
        }
        if (this.turn_controller.isDrawingElementsAllowed() == false) {
            throw new Error("Drawing elements is only allowed at the start of the turn")
        }
        if (this.turn_controller.isNumberOfDrawnElementsAllowed(elements.length) == false) {
            throw new Error("Maximum number of allowed elements to be requested have been exceded")
        }
        if (this.board_controller.checkElementPoolAvailability(elements) == false) {
            throw new Error("Requested elements cannot be taken from the pool");
        }
        for (let element of elements) {
            this.board_controller.getElementFromPool(element);
        }
        this.turn_controller.setDrawnElements(elements);
    }

    public placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void {

        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Placing element is not allowed in the current game state");
        }

        if (this.turn_controller.isPlaceElementAllowed() == false) {
            throw new Error("No more available elements to be placed");
        }

        if (this.turn_controller.removeElementFromList(element) == false) {
            throw new Error("The element is not from the Drawn elements");
        }
        this.board_controller.placeElement(element, position);
        this.board_controller.performElementReaction(element, position, reaction);

        const loser: string = this.board_controller.winningCondition(position);

        if (loser !== "") {
            this.model.loser_uuid = loser;
        }

        if (this.turn_controller.isEndOfTurn()) {
            this.nextPlayerTurn();
        }
    }

    private nextPlayerTurn(): void {

        let player_number: number = this.turn_controller.getPlayer() + 1
        if (player_number == this.model.game_type) {
            player_number = 0;
        }
        this.turn_controller.changeTurn(player_number);
    }

    public movePlayerSage(player: IPlayerModel, position: Position): void {

        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Moving sage is not allowed in the current game state");
        }
        if (this.turn_controller.isMovingSageAllowed() == false) {
            throw new Error("Cannot move sage, not available moves to spend");
        }
        this.board_controller.placePlayerSage(player, position);

        if (this.turn_controller.isEndOfTurn()) {
            this.nextPlayerTurn();
        }
    }

    public endOfPlayerTurn(): void {

        const remaining_elements: Array<ElementTypes> = this.turn_controller.getRemainingElements();

        for (let element of remaining_elements) {
            this.board_controller.returnElementToPool(element);
        }
        this.nextPlayerTurn();
    }

    public getBoard(): IBoardModel {
        return this.model.board;
    }

    public getTurnPlayer(): IPlayerModel {
        return this.model.player_list[this.turn_controller.getPlayer()];
    }

    public getGameState(): GameStates {
        return this.model.state;
    }

    public getWinner(): number | null {
        if (this.model.loser_uuid != "") {
            for (let player of this.model.player_list) {
                const player_controller: PlayerController = new PlayerController(player)
                if (player_controller.getSage().uuid === this.model.loser_uuid) {
                    return player_controller.getPlayerNumber();
                }
            }
        }
        return null;

    }
}