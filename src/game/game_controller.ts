import { GameCache } from "./game_cache";
import Room from "./models/room";
import { User } from "../game/user";
import { PublicServerResponse } from "@/schemas/server_response";

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

    public endTurn(loadedRoom: Room, room: Room): PublicServerResponse {
        // TODO !!! To implement

        return {
            room_uuid: room.getUuid(),
            board: room.getGame().getBoard(),
            player_turn_uuid: 'room.getGame().getTurnPlayer().getTurn()' // TODO !!! to be implemented
        }
    }
}