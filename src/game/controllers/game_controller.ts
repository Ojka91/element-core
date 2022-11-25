import { GameModel, GameStates } from "../models/game";
import Player from "../models/player";
import { ElementTypes } from "../models/elements/elements";
import { Reaction } from "@/schemas/player_actions";
import { Position } from "../models/grid";
import Board from "../models/board";
import { Turn } from "../models/turn";

export interface IGameController {
    addPlayer(player: Player): void;
    setupGame(game_type: number): void;
    drawingElements(elements: Array<ElementTypes>): void;
    placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void;
    movePlayerSage(player: Player, position: Position): void;
    endOfPlayerTurn(): void;
    getBoard(): Board;
    getTurnPlayer(): Player;
    getGameState(): GameStates;
    getWinner(): number | null;
}

export class GameController implements IGameController {

    private model: GameModel;

    constructor(model: GameModel) {
        this.model = model;
    }

    public addPlayer(player: Player): void {
        this.model.player_list.push(player);
    }

    public setupGame(game_type: number): void {
        // Resets the board
        this.model.board = new Board();
        this.model.player_list.forEach((player) => {
            this.model.board.createSageByPlayerAndGameType(player, game_type);
        })
        this.model.game_type = game_type;
        this.model.state = GameStates.GameRunning;
    }

    public drawingElements(elements: Array<ElementTypes>): void {
        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Cannot draw elements if the game hadn't started or has ended");
        }
        if (this.model.turn.isDrawingElementsAllowed() == false) {
            throw new Error("Drawing elements is only allowed at the start of the turn")
        }
        if (elements.length > Turn.MAX_ALLOWED_ELEMENTS) {
            throw new Error("Maximum number of allowed elements to be requested is " + Turn.MAX_ALLOWED_ELEMENTS + ", " + elements.length + " given")
        }
        if (this.model.board.checkElementPoolAvailability(elements) == false) {
            throw new Error("Requested elements cannot be taken from the pool");
        }
        for (let element of elements) {
            this.model.board.getElementFromPool(element);
        }
        this.model.turn.setDrawnElements(elements);
    }

    public placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void {
        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Placing element is not allowed in the current game state: " + this.model.state)
        }

        if (this.model.turn.isPlaceElementAllowed() == false) {
            throw new Error("No more available elements to be placed");
        }

        if (this.model.turn.removeElementFromList(element) == false) {
            throw new Error("The element is not from the Drawn elements");
        }
        this.model.board.placeElement(element, position);
        this.model.board.performElementReaction(element, position, reaction);

        const loser: string | null = this.model.board.winningCondition(position);

        if (loser != null) {
            this.model.loser_uuid = loser;
        }

        if (this.model.turn.isEndOfTurn()) {
            this.nextPlayerTurn();
        }
    }

    private nextPlayerTurn(): void {
        let player_number: number = this.model.turn.getPlayer() + 1
        if (player_number == this.model.game_type) {
            player_number = 0;
        }
        this.model.turn = new Turn(player_number);
    }

    public movePlayerSage(player: Player, position: Position): void {
        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Moving sage is not allowed in the current game state: " + this.model.state)
        }
        if (this.model.turn.isMovingSageAllowed() == false) {
            throw new Error("Cannot move sage, not available moves to spend");
        }
        this.model.board.placePlayerSage(player, position);

        if (this.model.turn.isEndOfTurn()) {
            this.nextPlayerTurn();
        }
    }

    public endOfPlayerTurn(): void {
        const remaining_elements: Array<ElementTypes> = this.model.turn.getRemainingElements();

        for (let element of remaining_elements) {
            this.model.board.returnElementToPool(element);
        }
        this.nextPlayerTurn();
    }

    public getBoard(): Board {
        return this.model.board;
    }

    public getTurnPlayer(): Player {
        return this.model.player_list[this.model.turn.getPlayer()];
    }

    public getGameState(): GameStates {
        return this.model.state;
    }

    public getWinner(): number | null {
        if (this.model.loser_uuid != null) {
            for (let player of this.model.player_list) {
                if (player.getSage().uuid === this.model.loser_uuid) {
                    return player.getPlayerNumber();
                }
            }
        }
        return null;

    }
}