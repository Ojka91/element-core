import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel, RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";

export default class ForceLoser {
    constructor(){}
    async execute(roomId: string, socketId: string): Promise<IRoomModel>{
        try {
            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())
            const player = roomController.getPlayerBySocketId(socketId)

            gameController.forceLoser(player.sage.uuid);
            
            await roomController.save();
            
            return roomModel
            
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}