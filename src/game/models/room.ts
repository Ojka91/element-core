import { User } from "../user";
import { Game } from "./game";
import { GameType } from "./game_utils";
import Player from "./player"

const MAX_PLAYERS_PER_ROOM = 4;

class Room {
    private uuid: string = "room_id_1123213"
    private user_map_list: Map<User, Player> = new Map();
    private game: Game = new Game();

    /** Returns the room uuid */
    public getUuid(): string {
        return this.uuid;
    }

    /** Add a user to the room if it's not full 
     * return: true if player added, false otherwise
    */
    public addUser(user: User): boolean {
        let user_added = false;
        if(this.isRoomFull() == false ){
            if(this.user_map_list.has(user) ){
                throw new Error("The same user cannot be in the Room twice")
            }
            const player: Player = new Player( this.user_map_list.size )
            this.user_map_list.set(user, player);
            user_added = true;
        }
        return user_added;
    }

    /** Return the user list */
    public getUserList(): Array<User> {
        let user_list: Array<User> = []
        this.user_map_list.forEach((player, user) => {
            user_list.push(user);
        })
        return user_list;
    }

    /** Return the player object by user */
    public getPlayerByUser(user: User): Player {
        return this.user_map_list.get(user)!
    }

    /** Return the user object by player */
    public getUserByPlayer(player: Player): User {
        for ( let user of this.user_map_list.keys()){
            if(this.user_map_list.get(user)! == player){
                return user;
            }
        }
        throw new Error("Player is not assigned to any user")
    }

    /** Checks whether the room is full of players 
     * return true if room is full, false otherwise
    */
    public isRoomFull(): boolean {
        return this.user_map_list.size == MAX_PLAYERS_PER_ROOM;
    }

    /** Starts the game */
    public gameStart(): boolean {
        let game_type: GameType
        switch(this.user_map_list.size){
            case 2:
                game_type = GameType.TwoPlayersGame
                break;
            case 3:
                game_type = GameType.ThreePlayersGame
                break;
            case 4:
                game_type = GameType.TwoPlayersGame
                break;
            default:
                return false;
                break;
        }

        this.user_map_list.forEach((player, user)=> {
            this.game.addPlayer(player);
        })

        this.game.setupGame(game_type);

        return true;
        
        
    }

    /** returns the game */
    public getGame(): Game {
        return this.game;
    }
}

export default Room;