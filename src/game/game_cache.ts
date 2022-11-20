import { RedisSingleton } from "@/redis";
import Room from "./models/room";

export class GameCache {

    public static async saveRoom(room: Room): Promise<void> {
        let cacher = RedisSingleton.getInstance();
        await cacher.set(room.getUuid(), room);
    }

    public static async loadRoom(room_id: string): Promise<Room> {
       await RedisSingleton.getInstance().get(room_id);
    }
    
}