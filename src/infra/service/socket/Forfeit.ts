import ForceLoser from "@/app/use-cases/game/ForceLoser";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";
import { GameServices } from "@/domain/service/GameServices";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { logger } from "@/utils/logger";
import { ForfeitData } from "../../socket/socketUtils";
import { InputSocket } from "../types/socketType";

export class ForfeitService {
    constructor(
    private socket: InputSocket,
    private setTurnTimerUseCase: SetTurnTimer
    ) {}

    /**
   * forfeit: A player surrender
   */
    public async execute(
        data: ForfeitData
    ): Promise<PublicServerResponse | null> {
        try {
            const forceLoserUseCase = new ForceLoser();
            this.setTurnTimerUseCase.cancel({ timerId: data.roomId });
            const room = await forceLoserUseCase.execute(data.roomId, this.socket.id);
            return GameServices.preparePublicResponse(room);
        } catch (error) {
            // If there is any error we will notify only to the client who generate the error
            logger.warn(error);
            const response = GameServices.preparePrivateErrorResponse(
                data.roomId,
        error as Error
            );
            this.socket.emit("error", response);
        }
        return null;
    }
}
