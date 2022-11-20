import { RedisSingleton } from "@/redis";
import Room from "./models/room";

export class GameCache {

    public static async saveRoom(room: Room): Promise<void> {
        await RedisSingleton.getInstance().set(room.getUuid(), room);
    }

    public static async loadRoom(room_id: string): Promise<Room> {
       await RedisSingleton.getInstance().get(room_id);
    }
    
}