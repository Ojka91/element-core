import { Reaction } from "@/schemas/player_actions";
import Board from "./board";
import { ElementTypes } from "./elements/elements";
import { GameStates, GameType } from "./game_utils";
import { Position } from "./grid";
import Player from "./player";
import { Turn } from "./turn";

export class Game {

    private state: GameStates = GameStates.NewGame;
    private player_list: Array<Player> = [];
    private board: Board = new Board();
    private turn: Turn = new Turn(0); // default overrided later
    private game_type: GameType = GameType.TwoPlayersGame; // default overrided later
    private loser_uuid: string | null = null

    public addPlayer(player: Player): void {
        this.player_list.push(player);
    }

    public setupGame(game_type: GameType): void {
        // Resets the board
        this.board = new Board();
        this.player_list.forEach((player) => {
            this.board.createSageByPlayerAndGameType(player, game_type);
        })
        this.game_type = game_type;
        this.state = GameStates.GameRunning;
    }

    public drawingElements(elements: Array<ElementTypes>): void {
        if(this.state != GameStates.GameRunning){
            throw new Error("Cannot draw elements if the game hadn't started or has ended");    
        }
        if(this.turn.isDrawingElementsAllowed() == false){
            throw new Error("Drawing elements is only allowed at the start of the turn")
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
        this.turn.setDrawnElements(elements);
    }

    public placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void {
        if(this.state != GameStates.GameRunning){
            throw new Error("Placing element is not allowed in the current game state: "+this.state)
        }

        if (this.turn.isPlaceElementAllowed() == false){
            throw new Error("No more available elements to be placed");
        }

        if(this.turn.removeElementFromList(element) == false){
            throw new Error("The element is not from the Drawn elements");
        }
        this.board.placeElement(element, position);
        this.board.performElementReaction(element, position, reaction);

        const loser: string | null = this.board.winningCondition(position);
        
        if(loser != null ){
            this.loser_uuid = loser;
        }

        if(this.turn.isEndOfTurn()){
            this.nextPlayerTurn();
        }
    }

    private nextPlayerTurn(): void {
        let player_number: number = this.turn.getPlayer() + 1
        if(player_number == this.game_type){
            player_number = 0;
        }
        this.turn = new Turn(player_number);
    }

    public movePlayerSage(player: Player, position: Position): void {
        if(this.state != GameStates.GameRunning){
            throw new Error("Moving sage is not allowed in the current game state: "+this.state)
        }
        if(this.turn.isMovingSageAllowed() == false){
            throw new Error("Cannot move sage, not available moves to spend");
        }
        this.board.placePlayerSage(player, position);

        if(this.turn.isEndOfTurn()){
            this.nextPlayerTurn();
        }
    }

    public endOfPlayerTurn(): void {
        const remaining_elements: Array<ElementTypes> = this.turn.getRemainingElements();
        
        for (let element of remaining_elements){
            this.board.returnElementToPool(element);
        }
        this.nextPlayerTurn();
    }

    public getBoard(): Board {
        return this.board;
    }

    public getTurnPlayer(): Player {
        return this.player_list[this.turn.getPlayer()];
    }

    public getGameState(): GameStates {
        return this.state;
    }

    public getWinner(): number | null {
        if(this.loser_uuid != null){    
            for (let player of this.player_list){
                if(player.getSage().uuid === this.loser_uuid){
                    return player.getPlayerNumber();
                }
            }
        }
        return null;
        
    }
}