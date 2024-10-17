import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import { UserModel } from "@/domain/game/models/user";
import GameCache from "@/infra/service/gameCache";
import { UserAuthData } from "@/infra/socket/socketUtils";

export type UserDataType = {
    socketId: string;
    username: string;
}

export default class JoinGame {

    static async execute(roomId: string, userData: UserDataType): Promise<UserAuthData>{
        try {
            const roomModel: RoomModel = new RoomModel(0);
            const roomController: RoomController = new RoomController(roomModel, GameCache);
            await roomController.loadRoomById(roomId);
        
            const user: UserModel = new UserModel()
            user.name = userData.username;
            user.socket_id = userData.socketId;
        
            roomController.addUser(user);
            await roomController.save();
            
            const player = roomController.getPlayerBySocketId(userData.socketId);

            return {
                userUuid: user.uuid,
                roomUuid: roomController.getUuid(),
                playerUuid: player.uuid
            }
        
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}