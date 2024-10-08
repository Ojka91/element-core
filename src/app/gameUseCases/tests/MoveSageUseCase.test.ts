import { GameController } from "@/domain/game/controllers/game_controller";
import RoomController from "@/domain/game/controllers/room_controller";
import { GameModel } from "@/domain/game/models/game";
import { RoomModel } from "@/domain/game/models/room";
import { GameServices } from "@/infra/service/GameServices";
import MoveSageUseCase from "../MoveSageUseCase";
import { IPlayerModel } from "@/domain/game/models/player";


jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('MoveSageUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should move sage', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(RoomController.prototype, 'getPlayerBySocketId').mockReturnValue({uuid: 'playerUUID'} as IPlayerModel)
        jest.spyOn(GameController.prototype, 'movePlayerSage').mockReturnValue()
        jest.spyOn(GameController.prototype, 'isPlayerTurn').mockReturnValue(true)
        jest.spyOn(GameServices, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        await MoveSageUseCase.execute('roomId', 'socketId', { row: 1, column: 3 });

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.movePlayerSage).toHaveBeenCalledTimes(1)

        jest.spyOn(GameController.prototype, 'isPlayerTurn').mockReturnValue(false)

        await expect(MoveSageUseCase.execute('roomId', 'socketId', { row: 1, column: 3 })
        ).rejects.toThrow(new Error('Its not your turn'))

    });

})
