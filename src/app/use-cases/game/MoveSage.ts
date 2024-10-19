import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { IRoomModel, RoomModel } from "@/domain/game/models/room";
import { Position } from "@/domain/game/utils/position_utils";
import GameCache from "@/infra/service/gameCache";
import SetTurnTimer from "../timer/SetTurnTimer";

export default class MoveSage {
    constructor(private turnTimerUseCase: SetTurnTimer) {}
    async execute(
        roomId: string,
        currentId: string,
        position: Position
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

            gameController.movePlayerSage(playerId, position);

            if (gameController.isEndOfTurn()) {
                gameController.endOfPlayerTurn();
                this.turnTimerUseCase.restart({ timerId: roomId });
            }

            await roomController.save();

            return roomModel;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
