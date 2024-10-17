import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";

export default class UpdateSocketId {
    static async execute(room: IRoomModel, userId: string, newSocketId: string){
        const roomController: RoomController = new RoomController(room, GameCache);
        roomController.updateSocketId(userId, newSocketId);
        await roomController.save(); 
    }
}