import Board from "./board";
import { GameType } from "./game_utils";
import { Position } from "./grid";
import Player from "./player";

export class Game {

    private player_list: Array<Player> = [];
    private turn_player: Player = new Player(0); // Default overridded later
    private board: Board = new Board();

    public addPlayer(player: Player): void {
        this.player_list.push(player);
    }

    public startGame(): void {
        // Resets the board
        this.board = new Board();

        const game_type: GameType = (this.player_list.length < 2) ? GameType.FourPlayersGame : GameType.TwoPlayersGame;
        this.player_list.forEach((player) => {
            this.board.createSageByPlayerAndGameType(player, game_type);
        })
        this.turn_player = this.player_list[0];
    }

    public movePlayerSage(player: Player, position: Position){
        this.board.placePlayerSage(player, position);
    }

    public getBoard(): Board {
        return this.board;
    }

    public getTurnPlayer(): Player {
        return this.turn_player;
    }
}