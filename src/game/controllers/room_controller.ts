import { GameController } from './game_controller'
import { GameCache } from './game_cache'
import { UserController } from './user_controller'

import { UserModel } from '../models/user'
import { IGameModel } from '../models/game'
import { IRoomModel } from '../models/room'
import { PlayerModel } from '../models/player'
import PlayerController from './player_controller'

interface IRoomController {
    getUuid(): string;
    addUser(user: UserModel): boolean;
    getUserList(): Array<UserModel>;
    isRoomFull(): boolean;
    gameStart(): boolean;
    getGame(): IGameModel;
    loadRoomById(room_id: string): Promise<void>;
}


class RoomController implements IRoomController {
    private model: IRoomModel;
    private game_controller: GameController;

    constructor(model: IRoomModel) {
        this.model = model
        this.game_controller = new GameController(this.model.game);
    }

    /** Returns the room uuid */
    public getUuid(): string {
        return this.model.uuid;
    }

    /** Add a user to the room if it's not full 
     * return: true if player added, false otherwise
    */
    public addUser(user: UserModel): boolean {
        let user_added = false;
        if (this.isRoomFull() == false) {
            if (this.model.user_list.includes(user)) {
                throw new Error("The same user cannot be in the Room twice")
            }
            const player: PlayerModel = new PlayerModel(this.model.user_list.length)
            this.game_controller.addPlayer(player);
            this.model.user_to_player_map.push({
                user_uuid: new UserController(user).getUuid(),
                player_uuid: new PlayerController(player).getUuid()
            });
            this.model.user_list.push(user);
            user_added = true;
        }
        return user_added;
    }

    /** Return the user list */
    public getUserList(): Array<UserModel> {
        return this.model.user_list;
    }

    /** Checks whether the room is full of players 
     * return true if room is full, false otherwise
    */
    public isRoomFull(): boolean {
        return this.model.user_list.length == this.model.size;
    }

    /** Starts the game */
    public gameStart(): boolean {
        if (this.isRoomFull() == false) {
            return false;
        }

        this.game_controller.setupGame(this.model.size);
        GameCache.saveRoom(this.model);

        return true;
    }

    /**
    * loadRoomById
    */
    public async loadRoomById(room_id: string): Promise<void> {
        this.model = await GameCache.loadRoom(room_id);

    }

    /** returns the game */
    public getGame(): IGameModel {
        return this.model.game;
    }
}

export default RoomController;