import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";
import { GameServices } from "@/infra/service/GameServices";

export default class ForceLoserUseCase {
    static async execute(roomId: string, socketId: string){
        try {
            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);

            const gameController: GameController = new GameController(roomController.getGame())
            const player = roomController.getPlayerBySocketId(socketId)

            gameController.forceLoser(player.sage.uuid);
            const winner = gameController.getWinner();
            await roomController.save();
            
            let publicResponse = GameServices.preparePublicResponse(roomModel);

            publicResponse.winner = winner;
            return publicResponse;

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}