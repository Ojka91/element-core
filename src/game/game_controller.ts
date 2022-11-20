import { GameCache } from "./game_cache";
import Room from "./models/room";

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
}