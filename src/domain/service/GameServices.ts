import { PrivateServerResponse, PrivateServerResponseStatus, PublicServerResponse } from "@/infra/schemas/server_response";
import { GameController } from "@/domain/game/controllers/game_controller";
import { IRoomModel } from "@/domain/game/models/room";

export class GameServices {
    static preparePublicResponse(roomModel: IRoomModel): PublicServerResponse {

        const gameController: GameController = new GameController(roomModel.game);
        return {
            room_uuid: roomModel.uuid,
            room: roomModel,
            player_turn_uuid: gameController.getTurnPlayer().uuid,
            winner: gameController.getWinner()
        }
    }

    static preparePrivateErrorResponse(roomId: string, error: Error): PrivateServerResponse {

        return {
            room_uuid: roomId,
            status: PrivateServerResponseStatus.ERROR,
            message: error.message,
          };
    }
}

