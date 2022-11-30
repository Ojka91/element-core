import { RedisSingleton } from "@/redis";
import { IRoomModel, RoomModelMap } from "../models/room";

export class GameCache {

    public static async saveRoom(room: IRoomModel): Promise<void> {
        await RedisSingleton.getInstance().set(room.uuid, new RoomModelMap().toDao(room));
    }

    public static async loadRoom(room_id: string): Promise<IRoomModel> {
        return new RoomModelMap().toDomain(await RedisSingleton.getInstance().get(room_id));
    }
}

export default GameCache;