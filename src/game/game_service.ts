import { Reaction } from "@/schemas/player_actions";
import { PublicServerResponse } from "@/schemas/server_response";
import { JoinQueue } from "@/socket";
import { Model } from "mongoose";
import { GameController } from "./controllers/game_controller";
import RoomController from "./controllers/room_controller";
import { ElementTypes } from "./models/elements/elements";
import { IPlayerModel } from "./models/player";
import { RoomModel } from "./models/room";
import { UserModel } from "./models/user";
import { Position } from "./utils/position_utils";

export class GameService {

    public async createRoom(data: JoinQueue): Promise<string> {
        const roomController: RoomController = new RoomController(new RoomModel(0));

        const roomModel = new RoomModel(this.getSizeRoom(data));
        roomController.loadRoom(roomModel);

        await roomController.save();

        return roomController.getUuid();
    }

    public async joinGame(roomId: string, userId: string): Promise<PublicServerResponse | null> {
        const roomController: RoomController = new RoomController(new RoomModel(0));
        await roomController.loadRoomById(roomId);

        const gameController: GameController = new GameController(roomController.getGame())

        const user: UserModel = new UserModel()
        user.name = userId;
        user.socket_id = userId;

        roomController.addUser(user);
        await roomController.save();
        if (roomController.isRoomFull()) {
            await roomController.gameStart();
            return this.preparePublicResponse(roomController, gameController)
        }
        return null;
    }

    public async endTurn(roomId: string): Promise<PublicServerResponse> {
        const roomController: RoomController = new RoomController(new RoomModel(0));
        await roomController.loadRoomById(roomId);

        const gameController: GameController = new GameController(roomController.getGame())
        gameController.endOfPlayerTurn();

        await roomController.save();

        return this.preparePublicResponse(roomController, gameController);

    }

    public async drawElements(roomId: string, elements: Array<ElementTypes>, socketId: string): Promise<PublicServerResponse> {
        const roomController: RoomController = new RoomController(new RoomModel(0));
        await roomController.loadRoomById(roomId);

        const gameController: GameController = new GameController(roomController.getGame())
        if(!this.isPlayerTurn(socketId, gameController)) {
            throw new Error('Its not your turn')
        }

        gameController.drawingElements(elements);

        await roomController.save();

        return this.preparePublicResponse(roomController, gameController);

    }

    public async placeElement(roomId: string, socketId: string, element: ElementTypes, position: Position, reaction?: Reaction): Promise<PublicServerResponse> {
        const roomController: RoomController = new RoomController(new RoomModel(0));
        await roomController.loadRoomById(roomId);

        const gameController: GameController = new GameController(roomController.getGame())

        if(!this.isPlayerTurn(socketId, gameController)) {
            throw new Error('Its not your turn')
        }

        gameController.placeElement(element, position, reaction);

        await roomController.save();

        return this.preparePublicResponse(roomController, gameController);

    }

    public async moveSage(roomId: string, socketId: string, player: IPlayerModel, position: Position): Promise<PublicServerResponse> {
        const roomController: RoomController = new RoomController(new RoomModel(0));
        await roomController.loadRoomById(roomId);

        const gameController: GameController = new GameController(roomController.getGame())

        if(!this.isPlayerTurn(socketId, gameController)) {
            throw new Error('Its not your turn')
        }
        
        gameController.movePlayerSage(player, position);

        await roomController.save();

        return this.preparePublicResponse(roomController, gameController);

    }

    public isPlayerTurn(socketId: string, gameController: GameController): boolean {
       return socketId === gameController.getTurnPlayer().uuid
    }

    public preparePublicResponse(roomController: RoomController, gameController: GameController): PublicServerResponse {

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

