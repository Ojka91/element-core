import { Reaction } from "@/schemas/player_actions";
import { PublicServerResponse } from "@/schemas/server_response";
import { Queue } from "@/socket/socketUtils";
import { GameController } from "../game/controllers/game_controller";
import RoomController from "../game/controllers/room_controller";
import { ElementTypes } from "../game/models/elements/elements";
import { GameModel } from "../game/models/game";
import { IPlayerModel } from "../game/models/player";
import { IRoomModel, RoomModel } from "../game/models/room";
import { UserModel } from "../game/models/user";
import { Position } from "../game/utils/position_utils";
import GameCache from "./game_cache";

export class GameService {

    public async createRoom(data: Queue): Promise<string> {
        try {
            const roomModel = new RoomModel(this.getSizeRoom(data));
            const roomController: RoomController = new RoomController(roomModel, GameCache);


            await roomController.save();

            return roomController.getUuid();
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public async joinGame(roomId: string, userId: string): Promise<PublicServerResponse | null> {
        try {
            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const user: UserModel = new UserModel()
            user.name = userId;
            user.socket_id = userId;

            roomController.addUser(user);
            await roomController.save();
            if (roomController.isRoomFull()) {
                await roomController.gameStart();
                return this.preparePublicResponse(roomModel);
            }
            return null;
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public async endTurn(roomId: string): Promise<PublicServerResponse> {
        try {

            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())
            gameController.endOfPlayerTurn();

            await roomController.save();

            return this.preparePublicResponse(roomModel);

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public async drawElements(roomId: string, numOfElements: number, socketId: string): Promise<PublicServerResponse> {
        try {

            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())
            if (!this.isPlayerTurn(socketId, gameController, roomController)) {
                throw new Error('Its not your turn')
            }

            gameController.drawingElements(numOfElements);

            await roomController.save();

            return this.preparePublicResponse(roomModel);

        } catch (error) {
            throw new Error((error as Error).message)

        }
    }

    public async placeElement(roomId: string, socketId: string, element: ElementTypes, position: Position, reaction?: Reaction): Promise<PublicServerResponse> {
        try {

            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())

            if (!this.isPlayerTurn(socketId, gameController, roomController)) {
                throw new Error('Its not your turn')
            }

            gameController.placeElement(element, position, reaction);

            await roomController.save();

            return this.preparePublicResponse(roomModel);

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public async moveSage(roomId: string, socketId: string, player: string, position: Position): Promise<PublicServerResponse> {
        try {

            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())

            if (!this.isPlayerTurn(socketId, gameController, roomController)) {
                throw new Error('Its not your turn')
            }

            gameController.movePlayerSage(player, position);

            await roomController.save();

            return this.preparePublicResponse(roomModel);

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public async forceLoser(roomId: string, socketId: string): Promise<PublicServerResponse> {
        try {
            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())

            gameController.forceLoser(socketId);
            const winner = gameController.getWinner();
            let publicResponse = this.preparePublicResponse(roomModel);

            await roomController.save();

            publicResponse.winner = winner;
            return publicResponse;

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public async playerDisconnect(roomsIds: string[], socketId: string): Promise<[PublicServerResponse, string]> {
        let response: PublicServerResponse = {
            room_uuid: '',
            room: new RoomModel(0),
            player_turn_uuid: ''
        };
        let roomId: string = '';
        // Looping through array of rooms
        roomsIds.every(async id => {
            // Getting users for every roomId
            let userList: Array<UserModel> = await this.getUserList(id)

            //Looping through array of users for certain room
            userList.every(async user => {
                // If user match, we update room and response
                if (user.socket_id === socketId) {
                    response = await this.forceLoser(id, socketId);
                    roomId = id;
                    return false;
                }
                return true;
            })
            return true;
        });
        return [response, roomId]
    }

    public async getUserList(roomId: string): Promise<Array<UserModel>> {
        try {

            const roomController: RoomController = new RoomController(new RoomModel(0), GameCache);
            await roomController.loadRoomById(roomId);

            return roomController.getUserList();

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public isPlayerTurn(socketId: string, gameController: GameController, roomController: RoomController): boolean {
        const player: IPlayerModel = roomController.getPlayerBySocketId(socketId);
        return player.uuid === gameController.getTurnPlayer().uuid
    }

    public preparePublicResponse(roomModel: IRoomModel): PublicServerResponse {

        const gameController: GameController = new GameController(roomModel.game);
        return {
            room_uuid: roomModel.uuid,
            room: roomModel,
            player_turn_uuid: gameController.getTurnPlayer().uuid,
            winner: gameController.getWinner()
        }

    }
    private getSizeRoom(queue: Queue): number {
        switch (queue) {
            case 'queue2': {
                return 2
            }
            case 'queue3': {
                return 3
            }
            case 'queue4': {
                return 4
            }
        }
        return 5;
    }
}

