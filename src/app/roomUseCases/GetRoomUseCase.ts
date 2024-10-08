import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";

export default class GetRoomUseCase {
    static async execute(roomId: string){
        const roomModel: RoomModel = new RoomModel(0);
        const roomController: RoomController = new RoomController(roomModel, GameCache);
        await roomController.loadRoomById(roomId);
        return roomModel;
    }
}