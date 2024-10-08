import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { GameModel } from "@/domain/game/models/game";
import { RoomModel } from "@/domain/game/models/room";
import { GameServices } from "@/infra/service/GameServices";
import EndTurnUseCase from "../EndTurnUseCase";


jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('EndTurnUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('Should endTurn', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(GameController.prototype, 'endOfPlayerTurn').mockReturnValue()
        jest.spyOn(GameServices, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        await EndTurnUseCase.execute('uuid');

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.endOfPlayerTurn).toHaveBeenCalledTimes(1)

    });

})
