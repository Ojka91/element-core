import { GameServices } from "@/infra/service/GameServices";
import GameStartUseCase from "../GameStartUseCase";
import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";


jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('GameStartUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should start a game', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'isRoomFull').mockReturnValueOnce(true)
        jest.spyOn(GameServices, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        let response = await GameStartUseCase.execute('RoomUUID');
        expect(response).not.toBeNull();
        expect(RoomController.prototype.gameStart).toHaveBeenCalledTimes(1)
        
        jest.spyOn(RoomController.prototype, 'isRoomFull').mockReturnValueOnce(false)
        response = await GameStartUseCase.execute('RoomUUID');
        expect(response).toBeNull();

    });
})
