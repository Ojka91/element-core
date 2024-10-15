import PlaceElement from "@/app/use-cases/game/PlaceElement";
import { GameServices } from "@/domain/service/GameServices";
import { PrivateServerResponse, PublicServerResponse } from "@/infra/schemas/server_response";
import { logger } from "@/utils/logger";
import { Socket } from "socket.io";
import {
  ClientToServerEvents,
  PlaceElementData,
  ServerToClientEvents,
} from "../../socket/socketUtils";

type InputSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export class PlaceElementService {
  constructor(private socket: InputSocket) {}
  /**
   * placeElement: Client which turn is playing should place element
   */
  public async execute(data: PlaceElementData): Promise<PublicServerResponse | null> {
    try {
      const room = await PlaceElement.execute(
        data.roomId,
        this.socket.id,
        data.element,
        data.position,
        data.reaction
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
