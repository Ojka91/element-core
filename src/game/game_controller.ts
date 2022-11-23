import { GameCache } from "./game_cache";
import Room from "./models/room";

export class GameController {

    private room: Room;

    constructor(room: Room){
        this.room = room;
    }

    public async gameStart(): Promise<void> {
        this.room.gameStart();
        await GameCache.saveRoom(this.room);
    }

    public async loadRoom(room_id: string): Promise<void> {
        this.room = await GameCache.loadRoom(room_id);
    }

    public userAction(room: Room, action_type: any): void {

    }
}