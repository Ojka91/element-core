import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";

export default class GetUserList {
    static async execute(roomId: string){
        try {

            const roomController: RoomController = new RoomController(new RoomModel(0), GameCache);
            await roomController.loadRoomById(roomId);

            return roomController.getUserList();

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}