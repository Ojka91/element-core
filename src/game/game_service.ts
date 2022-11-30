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
    private roomController: RoomController = new RoomController(new RoomModel(0));
    private gameController: GameController = new GameController(this.roomController.getGame());

    public async createRoom(data: JoinQueue): Promise<string> {
        const roomModel = new RoomModel(this.getSizeRoom(data));
        this.roomController.loadRoom(roomModel);

        await this.roomController.save();

        return this.roomController.getUuid();
    }

    public async joinGame(roomId: string, userId: string): Promise<RoomController> {
        await this.roomController.loadRoomById(roomId);

        const user: UserModel = new UserModel()
        user.name = userId;
        user.socket_id = userId;

        this.roomController.addUser(user);
        await this.roomController.save();
        return this.roomController;
    }

    public preparePublicResponse(roomController: RoomController): PublicServerResponse {
        this.gameController.loadGame(roomController.getGame());

        return {
            room_uuid: this.roomController.getUuid(),
            board: this.gameController.getBoard(),
            player_turn_uuid: this.gameController.getTurnPlayer().uuid
        }

    }

    public async endTurn(roomId: string): Promise<PublicServerResponse> {
        await this.roomController.loadRoomById(roomId);

        this.gameController.loadGame(this.roomController.getGame())

        this.gameController.endOfPlayerTurn();

        await this.roomController.save();

        return this.preparePublicResponse(this.roomController);

    }

    public async drawElements(roomId: string, elements: Array<ElementTypes>, socketId: string): Promise<PublicServerResponse> {
        await this.roomController.loadRoomById(roomId);

        this.gameController.loadGame(this.roomController.getGame())

        if(!this.isPlayerTurn(socketId)) {
            throw new Error('Its not your turn')
        }

        this.gameController.drawingElements(elements);

        await this.roomController.save();

        return this.preparePublicResponse(this.roomController);

    }

    public async placeElement(roomId: string, socketId: string, element: ElementTypes, position: Position, reaction?: Reaction): Promise<PublicServerResponse> {
        await this.roomController.loadRoomById(roomId);

        this.gameController.loadGame(this.roomController.getGame())

        if(!this.isPlayerTurn(socketId)) {
            throw new Error('Its not your turn')
        }

        this.gameController.placeElement(element, position, reaction);

        await this.roomController.save();

        return this.preparePublicResponse(this.roomController);

    }

    public async moveSage(roomId: string, socketId: string, player: IPlayerModel, position: Position): Promise<PublicServerResponse> {
        await this.roomController.loadRoomById(roomId);

        this.gameController.loadGame(this.roomController.getGame())

        if(!this.isPlayerTurn(socketId)) {
            throw new Error('Its not your turn')
        }

        this.gameController.movePlayerSage(player, position);

        await this.roomController.save();

        return this.preparePublicResponse(this.roomController);

    }

    public isPlayerTurn(socketId: string): boolean {
       return socketId === this.gameController.getTurnPlayer().uuid
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

