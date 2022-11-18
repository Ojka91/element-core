import { GameCache } from "./game_cache";
import Room from "./models/room";

export class GameController {

    private cache: GameCache = new GameCache();

    public gameStart(room: Room): void {
        room.gameStart();
        this.cache.saveRoom(room);
    }

    public loadRoom(room_id: string): Room {
        const room: any = this.cache.loadRoom(room_id);
        if(room == null){
            throw new Error("Room id: "+room_id+" couldn't be loaded");
        }
        return room as Room;
    }
}