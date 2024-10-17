import RoomController from "@/domain/game/controllers/room_controller";
import { UserModel } from "@/domain/game/models/user";
import GetUserList from "../GetUserList";

jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('GetUserListUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should return a user list', async () => {
        
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getUserList').mockReturnValueOnce([new UserModel()])
        
        const response = await GetUserList.execute('RoomUUID');
        expect(response).not.toBeNull();
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.getUserList).toHaveBeenCalledTimes(1)
    });
})