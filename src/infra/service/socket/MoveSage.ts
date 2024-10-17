import MoveSage from "@/app/use-cases/game/MoveSage";
import { GameServices } from "@/domain/service/GameServices";
import {
  PrivateServerResponse,
  PublicServerResponse,
} from "@/infra/schemas/server_response";
import { logger } from "@/utils/logger";
import { MoveSageData } from "../../socket/socketUtils";
import { InputSocket } from "../types/socketType";

export class MoveSageService {
  constructor(private socket: InputSocket) {}

  /**
   * moveSage: Client which turn is playing should move sage
   */

  public async execute(
    data: MoveSageData
  ): Promise<PublicServerResponse | null> {
    try {
      // TODO TBD !!! We should check if game ended => delete roomId from array

      const room = await MoveSage.execute(
        data.roomId,
        this.socket.id,
        data.position
      );
      return GameServices.preparePublicResponse(room);
    } catch (error) {
      // If there is any error we will notify only to the client who generate the error
      logger.warn(error);
      let response: PrivateServerResponse =
        GameServices.preparePrivateErrorResponse(data.roomId, error as Error);
      this.socket.emit("error", response);
    }
    return null;
  }
}
