import EndTurn from "@/app/use-cases/game/EndTurn";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";
import { GameServices } from "@/domain/service/GameServices";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { Socket } from "socket.io";
import {
  ClientToServerEvents,
  EndTurnData,
  ServerToClientEvents,
} from "../../socket/socketUtils";

type InputSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export class EndTurnService {
  constructor(
    private socket: InputSocket,
    private setTurnTimerUseCase: SetTurnTimer
  ) {}

  /**
   * endTurn: Client which turn is playing should emit to this event with all the changes in the board
   */
  public async execute(data: EndTurnData): Promise<PublicServerResponse> {
    const endTurnUseCase = new EndTurn(this.setTurnTimerUseCase);
    const roomData = await endTurnUseCase.execute(data.roomId);
    const response = GameServices.preparePublicResponse(roomData.model);
    response.winner = roomData.winner;

    return response;
  }
}
