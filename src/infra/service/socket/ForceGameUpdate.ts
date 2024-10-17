import GetRoom from "@/app/use-cases/room/GetRoom";
import { IRoomModel } from "@/domain/game/models/room";
import { GameServices } from "@/domain/service/GameServices";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { InputSocket } from "../types/socketType";

export class ForceGameUpdateService {
  constructor(private socket: InputSocket) {}

  public async execute(): Promise<PublicServerResponse> {
    /**
     * When client triggers this event, an event is sent to the room1 under boardMovement event
     */
    const room: IRoomModel = await GetRoom.execute(
      this.socket.handshake.auth.roomUuid
    );
    return GameServices.preparePublicResponse(room);
  }
}
