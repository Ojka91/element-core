import RoomController from "@/domain/game/controllers/room_controller";
import ForceLoserUseCase from "../ForceLoserUseCase";
import { GameController } from "@/domain/game/controllers/game_controller";
import { GameModel } from "@/domain/game/models/game";
import { RoomModel } from "@/domain/game/models/room";
import { GameServices } from "@/infra/service/GameServices";
import { IPlayerModel } from "@/domain/game/models/player";

jest.mock('@/domain/game/controllers/room_controller')
jest.mock('@/domain/game/controllers/game_controller')
describe('ForceLoserUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should force loser', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        // jest.spyOn(GameController.prototype, 'endOfPlayerTurn').mockReturnValue()
        jest.spyOn(RoomController.prototype, 'getPlayerBySocketId').mockReturnValue({
            uuid: 'playerUUID',
            sage: {
                uuid: 'sageUUID'
            }
        } as IPlayerModel)
        jest.spyOn(GameController.prototype, 'getWinner').mockReturnValue('otherPlayerUUID')
        jest.spyOn(GameServices, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID',
            winner: 'otherPlayerUUID'
        })

        await ForceLoserUseCase.execute('roomUUID', 'SocketUuid');

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.forceLoser).toHaveBeenCalledTimes(1)

    });

})
