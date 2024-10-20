import { GameController } from './game_controller'
import { UserController } from './user_controller'
import { UserModel } from '../models/user'
import { IGameModel } from '../models/game'
import { IRoomModel, RoomModel } from '../models/room'
import { IPlayerModel, PlayerModel } from '../models/player'
import PlayerController from './player_controller'

interface IGameCache {
    saveRoom(room: IRoomModel): Promise<void>;
    loadRoom(room_id: string): Promise<IRoomModel>;
    deleteRoom(room_id: string): Promise<void>;
}

interface IRoomController {
    getUuid(): string;
    addUser(user: UserModel): boolean;
    getUserList(): Array<UserModel>;
    isRoomFull(): boolean;
    gameStart(updateCB: CallableFunction): Promise<boolean>;
    getGame(): IGameModel;
    loadRoomById(room_id: string): Promise<void>;
    save(): Promise<void>;
}

class RoomController implements IRoomController {
    private model: IRoomModel;
    private cache: IGameCache;

    constructor(model: IRoomModel, cacheService: IGameCache) {
        this.model = model
        this.cache = cacheService;
    }

    /** Returns the room uuid */
    public getUuid(): string {
        return this.model.uuid;
    }

    /** Add a user to the room if it's not full 
     * return: true if player added, false otherwise
    */
    public addUser(user: UserModel): boolean {
        const game_controller: GameController = new GameController(this.model.game);
        let user_added = false;
        if (this.isRoomFull() == false) {
            if (this.model.user_list.includes(user)) {
                throw new Error("The same user cannot be in the Room twice")
            }
            const player: PlayerModel = new PlayerModel(this.model.user_list.length)
            game_controller.addPlayer(player);
            this.model.user_to_player_map.push({
                user_uuid: new UserController(user).getUuid(),
                player_uuid: new PlayerController(player).getUuid(),
                socket_uuid: user.socket_id
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

    /** Update socket id */
    public updateSocketId(userUuid: string, socketId: string): void {
        this.model.user_list.forEach(user => {
            if (user.uuid === userUuid) {
                user.socket_id = socketId;
            }
        })

        this.model.user_to_player_map.forEach(user => {
            if (user.user_uuid === userUuid) {
                user.socket_uuid = socketId;
            }
        })
    }


    /**
     * getPlayerBySocketId
     */
    public getPlayerBySocketId(user_id: string): IPlayerModel {
        const game_controller: GameController = new GameController(this.model.game);
        for (const user of this.model.user_to_player_map) {
            if (user_id === user.socket_uuid) {
                return game_controller.getPlayerById(user.player_uuid);
            }
        }
        throw new Error("User ID not found")
    }

    /** Checks whether the room is full of players 
     * return true if room is full, false otherwise
    */
    public isRoomFull(): boolean {
        return this.model.user_list.length == this.model.size;
    }

    /** Starts the game */
    public async gameStart(): Promise<boolean> {
        const game_controller: GameController = new GameController(this.model.game);
        if (this.isRoomFull() == false) {
            return false;
        }

        game_controller.setupGame(this.model.size);
        await this.cache.saveRoom(this.model);

        return true;
    }

    /**
    * loadRoomById
    */
    public async loadRoomById(room_id: string): Promise<void> {
        const room: RoomModel = await this.cache.loadRoom(room_id);
        Object.assign(this.model, room);

    }

    /** returns the game */
    public getGame(): IGameModel {
        return this.model.game;
    }

    public async save(): Promise<void> {
        await this.cache.saveRoom(this.model);
    }

    public async deleteRoomById(room_id: string): Promise<void> {
        await this.cache.deleteRoom(room_id);
    }
}

export default RoomController;