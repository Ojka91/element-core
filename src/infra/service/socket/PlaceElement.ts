import PlaceElement from "@/app/use-cases/game/PlaceElement";
import { GameServices } from "@/domain/service/GameServices";
import {
    PrivateServerResponse,
    PublicServerResponse,
} from "@/infra/schemas/server_response";
import { logger } from "@/utils/logger";
import { PlaceElementData } from "../../socket/socketUtils";
import { InputSocket } from "../types/socketType";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";

export class PlaceElementService {
    constructor(private socket: InputSocket, private turnTimerUseCase: SetTurnTimer) {}
    /**
   * placeElement: Client which turn is playing should place element
   */
    public async execute(
        data: PlaceElementData
    ): Promise<PublicServerResponse | null> {
        try {
            const placeElementUseCase = new PlaceElement(this.turnTimerUseCase)
            const room = await placeElementUseCase.execute(
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
            const response: PrivateServerResponse =
        GameServices.preparePrivateErrorResponse(data.roomId, error as Error);
            this.socket.emit("error", response);
        }
        return null;
    }
}
