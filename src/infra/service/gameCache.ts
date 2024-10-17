import { RedisSingleton } from "@/infra/redis";
import { IRoomModel, RoomModelMap } from "@/domain/game/models/room";

export class GameCache {

    public static async saveRoom(room: IRoomModel): Promise<void> {
        await RedisSingleton.getInstance().set(room.uuid, new RoomModelMap().toDao(room));
    }

    public static async loadRoom(room_id: string): Promise<IRoomModel> {
        return new RoomModelMap().toDomain(await RedisSingleton.getInstance().get(room_id));
    }

    public static async deleteRoom(room_id: string): Promise<void> {
        await RedisSingleton.getInstance().delete(room_id);
    }
}

export default GameCache;