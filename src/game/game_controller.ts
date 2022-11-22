import { GameCache } from "./game_cache";
import Room from "./models/room";
import { User } from "../game/user";
import { PublicServerResponse } from "@/schemas/server_response";

export class GameController {

    public async gameStart(room: Room): Promise<void> {
        room.gameStart();
        await GameCache.saveRoom(room);
    }

    public async loadRoom(room_id: string): Promise<Room> {
        return await GameCache.loadRoom(room_id);
    }

    public async saveRoom(room: Room): Promise<void> {
        await GameCache.saveRoom(room);
    }

    public async createRoom(): Promise<string> {
        let room = new Room();
        await GameCache.saveRoom(room);
        return room.getUuid();
    }

    public addUser(room: Room, socket_id: string): void {
        room.addUser(new User(socket_id)); // Username is socketid
    }

    public isRoomFull(room: Room): boolean {
        return room.isRoomFull()
    }

    public preparePublicResponse(room: Room): PublicServerResponse {
        return {
            room_uuid: room.getUuid(),
            board: room.getGame().getBoard(),
            player_turn_uuid: 'room.getGame().getTurnPlayer().getTurn()' // TODO !!! to be implemented
        }
    }
}