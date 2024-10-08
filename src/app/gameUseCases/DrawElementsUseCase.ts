import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import GameCache from "@/infra/service/gameCache";
import { GameServices } from "@/infra/service/GameServices";

export default class DrawElementsUseCase {
  static async execute(
    roomId: string,
    numOfElements: number,
    currentId: string
  ): Promise<PublicServerResponse> {
    try {
      const roomModel: RoomModel = new RoomModel(0);
      const roomController: RoomController = new RoomController(
        roomModel,
        GameCache
      );
      await roomController.loadRoomById(roomId);

      const gameController: GameController = new GameController(
        roomController.getGame()
      );
      const playerId: string =
        roomController.getPlayerBySocketId(currentId).uuid;
      if (!gameController.isPlayerTurn(playerId)) {
        throw new Error("Its not your turn");
      }

      gameController.drawingElements(numOfElements);

      await roomController.save();

      return GameServices.preparePublicResponse(roomModel);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
