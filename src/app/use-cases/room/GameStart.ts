import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel, RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";

export default class GameStart {
    constructor(){

    }
    async execute(roomId: string): Promise<IRoomModel | null>{
        const roomModel: RoomModel = new RoomModel(0);
        const roomController: RoomController = new RoomController(roomModel, GameCache);
        await roomController.loadRoomById(roomId);
        if(roomController.isRoomFull()){
            await roomController.gameStart();
            return roomModel;
        }
        return null;
    }
}