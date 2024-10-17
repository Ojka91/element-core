import GameStart from "@/app/use-cases/room/GameStart";
import JoinGame from "@/app/use-cases/room/JoinGame";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";
import { GameServices } from "@/domain/service/GameServices";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { JoinGameData, UserAuthData } from "../../socket/socketUtils";
import { InputSocket } from "../types/socketType";

export class JoinGameService {
  constructor(
    private socket: InputSocket,
    private setTurnTimerUseCase: SetTurnTimer,
    private gameStartUseCase: GameStart
  ) {}
  /**
   * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
   * 1. Client should join game/roomId socket and as user on the game room
   * 2. We check if all players have joined or we are still waiting for someone to join
   * 2.1 If so, we start the game
   */
  public async execute(
    data: JoinGameData
  ): Promise<PublicServerResponse | null> {
    // 1. Join game/roomId socket
    this.socket.join(data.roomId);
    // 1. Join user into the game room
    const userAuthData: UserAuthData = await JoinGame.execute(data.roomId, {
      socketId: this.socket.id,
      username: data.username,
    });
    console.log({ userAuthData });
    // We emit auth userData to joinedSocket
    this.socket.emit("userAuthData", userAuthData);

    // When room is full we startGame and send gameUpdate to the players
    const responseData = await this.gameStartUseCase.execute(data.roomId);
    if (responseData != null) {
      this.setTurnTimerUseCase.execute({ timerId: data.roomId });
      return GameServices.preparePublicResponse(responseData);
    }
    return null;
  }
}
