import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { GameModel } from "@/domain/game/models/game";
import { GameServices } from "@/infra/service/GameServices";
import DrawElementsUseCase from "../DrawElementsUseCase";
import { RoomModel } from "@/domain/game/models/room";
import { IPlayerModel, PlayerModel } from "@/domain/game/models/player";


jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('DrawElementsUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should draw elements', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(RoomController.prototype, 'getPlayerBySocketId').mockReturnValue({uuid: 'playerUUID'} as IPlayerModel)
        jest.spyOn(GameController.prototype, 'drawingElements').mockReturnValue()
        jest.spyOn(GameController.prototype, 'isPlayerTurn').mockReturnValue(true)
        jest.spyOn(GameServices, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        await DrawElementsUseCase.execute('roomId', 1, 'socketId');

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.drawingElements).toHaveBeenCalledTimes(1)

        jest.spyOn(GameController.prototype, 'isPlayerTurn').mockReturnValue(false)

        await expect(DrawElementsUseCase.execute('roomId', 1, 'socketId')).rejects.toThrow('Its not your turn')

    });

})
