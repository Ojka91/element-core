import { Reaction } from "@/schemas/player_actions";
import { PublicServerResponse } from "@/schemas/server_response";
import { JoinQueue } from "@/socket";
import { GameController } from "./controllers/game_controller";
import RoomController from "./controllers/room_controller";
import { ElementTypes } from "./models/elements/elements";
import { IPlayerModel } from "./models/player";
import { RoomModel } from "./models/room";
import { UserModel } from "./models/user";
import { Position } from "./utils/position_utils";

export class GameService {

    public async createRoom(data: JoinQueue): Promise<string> {
        const [roomController, _gameController] = this.createControllers()
        const roomModel = new RoomModel(this.getSizeRoom(data));
        roomController.loadRoom(roomModel);

        await roomController.save();

        return roomController.getUuid();
    }

    public async joinGame(roomId: string, userId: string): Promise<RoomController> {
        const [roomController, _gameController] = this.createControllers()
        await roomController.loadRoomById(roomId);

        const user: UserModel = new UserModel()
        user.name = userId;
        user.socket_id = userId;

        roomController.addUser(user);
        await roomController.save();
        return roomController;
    }

    public async endTurn(roomId: string): Promise<PublicServerResponse> {
        const [roomController, gameController] = this.createControllers()
        await roomController.loadRoomById(roomId);

        gameController.loadGame(roomController.getGame())

        gameController.endOfPlayerTurn();

        await roomController.save();

        return this.preparePublicResponse(roomController);

    }

    public async drawElements(roomId: string, elements: Array<ElementTypes>, socketId: string): Promise<PublicServerResponse> {
        const [roomController, gameController] = this.createControllers()
        await roomController.loadRoomById(roomId);

        gameController.loadGame(roomController.getGame())

        if(!this.isPlayerTurn(socketId)) {
            throw new Error('Its not your turn')
        }

        gameController.drawingElements(elements);

        await roomController.save();

        return this.preparePublicResponse(roomController);

    }

    public async placeElement(roomId: string, socketId: string, element: ElementTypes, position: Position, reaction?: Reaction): Promise<PublicServerResponse> {
        const [roomController, gameController] = this.createControllers()
        await roomController.loadRoomById(roomId);

        gameController.loadGame(roomController.getGame())

        if(!this.isPlayerTurn(socketId)) {
            throw new Error('Its not your turn')
        }

        gameController.placeElement(element, position, reaction);

        await roomController.save();

        return this.preparePublicResponse(roomController);

    }

    public async moveSage(roomId: string, socketId: string, player: IPlayerModel, position: Position): Promise<PublicServerResponse> {
        const [roomController, gameController] = this.createControllers()
        await roomController.loadRoomById(roomId);

        gameController.loadGame(roomController.getGame())

        if(!this.isPlayerTurn(socketId)) {
            throw new Error('Its not your turn')
        }
        
        gameController.movePlayerSage(player, position);

        await roomController.save();

        return this.preparePublicResponse(roomController);

    }

    public isPlayerTurn(socketId: string): boolean {
        const [_roomController, gameController] = this.createControllers()
       return socketId === gameController.getTurnPlayer().uuid
    }

    private createControllers(): [RoomController, GameController] {
        const roomController: RoomController = new RoomController(new RoomModel(0));
        const gameController: GameController = new GameController(roomController.getGame())
        return [roomController, gameController]
    }

    public preparePublicResponse(roomController: RoomController): PublicServerResponse {
        const [_roomController, gameController] = this.createControllers()

        gameController.loadGame(roomController.getGame());

        return {
            room_uuid: roomController.getUuid(),
            board: gameController.getBoard(),
            player_turn_uuid: gameController.getTurnPlayer().uuid
        }

    }
    private getSizeRoom(queue: JoinQueue): number {
        switch (queue.queue) {
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

