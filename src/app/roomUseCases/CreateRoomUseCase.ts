import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import GameCache from "@/infra/service/gameCache";
import { Queue } from "@/infra/socket/socketUtils";

const queueToRoomSizeMap = new Map<string, number>([
    ['queue2', 2],
    ['queue3', 3],
    ['queue4', 4]
])

export default class CreateRoomUseCase {
    static async execute(queue: Queue): Promise<string> {
        try {
            const roomSize: number | undefined = queueToRoomSizeMap.get(queue);
            if(roomSize === undefined){
                throw new Error(`Queue ${queue} is not allowed`)    
            }
            const roomModel = new RoomModel(roomSize);
            const roomController: RoomController = new RoomController(roomModel, GameCache);


            await roomController.save();

            return roomController.getUuid();
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}