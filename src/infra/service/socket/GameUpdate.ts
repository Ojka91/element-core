import { Server } from "socket.io";
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "../../socket/socketUtils";
import {
    PublicServerResponse,
} from "@/infra/schemas/server_response";

import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";

type SocketIo = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export class GameUpdateService {
    constructor(
    private io: SocketIo,
    private setTurnTimerUseCase: SetTurnTimer
    ) {
    }

    public execute(roomId: string, data: PublicServerResponse | null) {
    
        const remainingTurnTime = this.setTurnTimerUseCase.getRemainingTime({timerId: roomId})!;
        if (data != null && remainingTurnTime != null) {
            data.room.game.turn.remainingTurnTime = remainingTurnTime;
        }
        this.io.to(roomId).emit("gameUpdate", data);
    }
}
