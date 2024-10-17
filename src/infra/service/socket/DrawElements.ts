import DrawElements from "@/app/use-cases/game/DrawElements";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";
import { GameServices } from "@/domain/service/GameServices";
import {
  PrivateServerResponse,
  PublicServerResponse,
} from "@/infra/schemas/server_response";
import { logger } from "@/utils/logger";
import { DrawElementsData } from "../../socket/socketUtils";
import { InputSocket } from "../types/socketType";

export class DrawElementsService {
  constructor(
    private socket: InputSocket,
    private setTurnTimerUseCase: SetTurnTimer
  ) {}

  /**
   * drawElements: Client which turn is playing should draw elements
   */
  public async execute(
    data: DrawElementsData
  ): Promise<PublicServerResponse | null> {
    try {
      const drawElementsUseCase = new DrawElements(this.setTurnTimerUseCase);
      const room = await drawElementsUseCase.execute(
        data.roomId,
        data.numOfElements,
        this.socket.id
      );
      return GameServices.preparePublicResponse(room);
    } catch (error) {
      // If there is any error we will notify only to the client who generate the error
      logger.warn(error);
      const response_error: PrivateServerResponse =
        GameServices.preparePrivateErrorResponse(data.roomId, error as Error);
      this.socket.emit("error", response_error);
    }
    return null;
  }
}
