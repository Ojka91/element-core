import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel, RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";
import SetTurnTimer from "../timer/SetTurnTimer";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { GameServices } from "@/domain/service/GameServices";
import { response } from "express";

const TURN_INNACTIVITY_ALLOWANCE = 3;

export default class TurnTimeout {
  constructor(private setTurnTimerUseCase: SetTurnTimer) {}
  async execute(roomId: string): Promise<PublicServerResponse> {
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

      let innactivityCounter = gameController.getCurrentPlayerInnactivityCounter();
      if(innactivityCounter >= TURN_INNACTIVITY_ALLOWANCE){
        // Force the player to lose
        gameController.forceCurrentPlayerLoser();
        this.setTurnTimerUseCase.cancel({ timerId: roomId });
      } else {
        innactivityCounter = gameController.increaseCurrentPlayerInnactivityCounter();
        gameController.endOfPlayerTurn();
        this.setTurnTimerUseCase.restart({ timerId: roomId });
      }
      await roomController.save()
      const response = GameServices.preparePublicResponse(roomModel);
      response.winner = gameController.getWinner();
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
