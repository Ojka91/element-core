import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel, RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";
import SetTurnTimer from "../timer/SetTurnTimer";

export default class DrawElements {
  constructor(private setTurnTimerUseCase: SetTurnTimer) {}

  async execute(
    roomId: string,
    numOfElements: number,
    currentId: string
  ): Promise<IRoomModel> {
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
      gameController.resetCurrentPlayerInnactivityCounter();

      await roomController.save();

      return roomModel;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
