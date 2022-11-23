import { Reactions } from "@/schemas/player_actions";
import Board from "./board";
import { ElementTypes } from "./elements/elements";
import { GameStates, GameType } from "./game_utils";
import { Position } from "./grid";
import Player from "./player";
import { Turn } from "./turn";

export class Game {

    private state: GameStates = GameStates.NewGame;
    private player_list: Array<Player> = [];
    private turn_player: Player = new Player(0); // Default overridded later
    private board: Board = new Board();
    private turn_status: Turn = new Turn();

    public addPlayer(player: Player): void {
        this.player_list.push(player);
    }

    public setupGame(game_type: GameType): void {
        // Resets the board
        this.board = new Board();
        this.player_list.forEach((player) => {
            this.board.createSageByPlayerAndGameType(player, game_type);
        })
        this.turn_player = this.player_list[0];
        this.state = GameStates.StartTurn;
    }

    public drawingElements(elements: Array<ElementTypes>): void {
        if(this.state != GameStates.StartTurn){
            throw new Error("Get turn elements not allowed in the current game state: "+this.state)
        }
        if(elements.length > Turn.MAX_ALLOWED_ELEMENTS){
            throw new Error("Maximum number of allowed elements to be requested is "+Turn.MAX_ALLOWED_ELEMENTS+ ", "+elements.length+" given")
        }
        if(this.board.checkElementPoolAvailability(elements) == false){
            throw new Error("Requested elements cannot be taken from the pool");
        }
        for( let element of elements){
            this.board.getElementFromPool(element);
        }
        this.turn_status.chosen_elements = elements;
        this.turn_status.available_sage_moves = Turn.MIN_SAGE_MOVEMENTS + Turn.MAX_ALLOWED_ELEMENTS - elements.length;

        this.state = GameStates.PlayerTurn;
    }

    public placeElement(element: ElementTypes, position: Position, reactions?: Reactions): void {
        if(this.state != GameStates.PlayerTurn){
            throw new Error("Placing element is not allowed in the current game state: "+this.state)
        }
        this.board.placeElement(element, position, reactions);
    }

    public movePlayerSage(player: Player, position: Position): void {
        if(this.state != GameStates.PlayerTurn){
            throw new Error("Moving sage is not allowed in the current game state: "+this.state)
        }
        this.board.placePlayerSage(player, position);
    }

    public getBoard(): Board {
        return this.board;
    }

    public getTurnPlayer(): Player {
        return this.turn_player;
    }

    public getGameState(): GameStates {
        return this.state;
    }
}