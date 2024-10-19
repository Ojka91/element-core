import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel, RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";
import SetTurnTimer from "../timer/SetTurnTimer";

export class EndTurnResponse {
    constructor(readonly model: IRoomModel, readonly winner: string | null) {}
}

export default class EndTurn {
    constructor(private setTurnTimerUseCase: SetTurnTimer) {}
    async execute(roomId: string): Promise<EndTurnResponse> {
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

            gameController.endOfPlayerTurn();
      

            if (gameController.getWinner() != null) {
                // End of the game therefore no need for keep the timer running
                this.setTurnTimerUseCase.cancel({ timerId: roomId });
                roomController.deleteRoomById(roomId);
            } else {
                this.setTurnTimerUseCase.restart({ timerId: roomId });
                await roomController.save();
            }

            return { model: roomModel, winner: gameController.getWinner() };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
