import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import GameCache from "@/infra/service/gameCache";
import { GameServices } from "@/infra/service/GameServices";

export default class GameStartUseCase {
    static async execute(roomId: string): Promise<PublicServerResponse | null>{
        const roomModel: RoomModel = new RoomModel(0);
        const roomController: RoomController = new RoomController(roomModel, GameCache);
        await roomController.loadRoomById(roomId);
        if(roomController.isRoomFull()){
            await roomController.gameStart();
            return GameServices.preparePublicResponse(roomModel)
        }
        return null;
    }
}