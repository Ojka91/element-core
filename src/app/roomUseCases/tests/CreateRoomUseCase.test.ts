import RoomController from "@/domain/game/controllers/room_controller";
import CreateRoomUseCase from "../CreateRoomUseCase";
import { Queue } from "@/infra/socket/socketUtils";

jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('GameService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should create room', async () => {
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getUuid').mockReturnValueOnce('uuid')
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()

        const response = await CreateRoomUseCase.execute(Queue.queue2);
        expect(response).toBe('uuid');
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.getUuid).toHaveBeenCalledTimes(1)

    });
})
