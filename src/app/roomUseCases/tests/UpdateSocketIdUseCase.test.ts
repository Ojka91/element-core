import RoomController from "@/domain/game/controllers/room_controller";
import UpdateSocketIdUseCase from "../UpdateSocketIdUseCase";
import { RoomModel } from "@/domain/game/models/room";

jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('UpdateSocketIdUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should update the socket id', async () => {
        
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        
        const response = await UpdateSocketIdUseCase.execute(new RoomModel(0), 'RoomUUID', 'NewSocketId');
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
    });
})