import { Redis, RedisSingleton } from "@/redis";
import Room from "./models/room";

export class GameCache {

    private cacher: Redis = RedisSingleton.getInstance();

    public saveRoom(room: Room): void {
        this.cacher.connect().then(() => {
            this.cacher.set(room.getUuid(), room);
        }).catch((eason: any) => {
            throw new Error("Couldn't connect to cache service")
        })
    }

    public loadRoom(room_id: string): Room | void {
        this.cacher.connect().then(() => {
            this.cacher.get(room_id).then( (room: any) => {
                return room as Room;
            }).catch((error: any) => {
                throw new Error("Room with id: "+room_id+" couldn't get loaded")
            })
        }).catch((eason: any) => {
            throw new Error("Couldn't connect to cache service")
        })
        return;
    }
    
}