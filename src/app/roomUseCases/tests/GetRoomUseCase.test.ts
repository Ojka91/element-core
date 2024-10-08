import RoomController from "@/domain/game/controllers/room_controller";
import GetRoomUseCase from "../GetRoomUseCase";
import CreateRoomUseCase from "../CreateRoomUseCase";
import { Queue } from "@/infra/socket/socketUtils";


jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('GetRoomUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should get a room model', async () => {
        const roomId = await CreateRoomUseCase.execute(Queue.queue2);
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        
        let response = await GetRoomUseCase.execute(roomId);
        expect(response).not.toBeNull();
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
    });
})
