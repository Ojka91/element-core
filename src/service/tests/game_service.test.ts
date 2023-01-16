import { Queue } from "@/socket/socketUtils";
import { GameController } from "../../game/controllers/game_controller";
import RoomController from "../../game/controllers/room_controller";
import { GameService } from "../../service/game_service";
import { ElementTypes } from "../../game/models/elements/elements";
import { GameModel } from "../../game/models/game";
import { PlayerModel } from "../../game/models/player";
import { RoomModel } from "../../game/models/room";
import exp from "constants";

jest.mock('../../game/controllers/room_controller')
jest.mock('../../game/controllers/game_controller')
describe('GameService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should create room', async () => {
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getUuid').mockReturnValueOnce('uuid')
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()

        const gameService = new GameService();
        const response = await gameService.createRoom(Queue.queue2);
        expect(response).toBe('uuid');
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.getUuid).toHaveBeenCalledTimes(1)

    });

    it('Client should join game', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'getUuid').mockReturnValueOnce('uuid')
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(RoomController.prototype, 'gameStart').mockResolvedValueOnce(true)
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        let response = await gameService.joinGame('123', {socketId: '1234', username: '4321'})
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(response).toHaveProperty('roomUuid');
        expect(response).toHaveProperty('userUuid');

    });
    it('Should return if room is full', async () => {
        jest.spyOn(RoomController.prototype, 'isRoomFull').mockReturnValueOnce(true);
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        const gameService = new GameService();
        let response = await gameService.isRoomFull('1234');
        expect(response).toBe(true)
    })

    it('Should start game', async () => {
        jest.spyOn(RoomController.prototype, 'gameStart').mockResolvedValue(true);
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        const gameService = new GameService();
        await gameService.gameStart('1234');
        expect(RoomController.prototype.gameStart).toBeCalledTimes(1)
    })

    it('Should endTurn', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(GameController.prototype, 'endOfPlayerTurn').mockReturnValue()
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        await gameService.endTurn('uuid');

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.endOfPlayerTurn).toHaveBeenCalledTimes(1)

    });

    it('Should draw elements', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(GameController.prototype, 'drawingElements').mockReturnValue()
        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(true)
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        await gameService.drawElements('roomId', 1, 'socketId');

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.drawingElements).toHaveBeenCalledTimes(1)

        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(false)

        expect(async () => {
            await gameService.drawElements('roomId', 1, 'socketId')
        }).rejects.toThrow(new Error('Its not your turn'))

    });

    it('Should place elements', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(GameController.prototype, 'placeElement').mockReturnValue()
        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(true)
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        await gameService.placeElement('roomId', 'socketId', ElementTypes.Earth, { row: 1, column: 3 });

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.placeElement).toHaveBeenCalledTimes(1)

        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(false)

        expect(async () => {
            await gameService.drawElements('roomId', 1, 'socketId')
        }).rejects.toThrow(new Error('Its not your turn'))

    });

    it('Should move sage', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(GameController.prototype, 'movePlayerSage').mockReturnValue()
        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(true)
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            room: new RoomModel(0),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        await gameService.moveSage('roomId', 'socketId', new PlayerModel(2).uuid, { row: 1, column: 3 });

        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.movePlayerSage).toHaveBeenCalledTimes(1)

        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(false)

        expect(async () => {
            await gameService.drawElements('roomId', 1, 'socketId')
        }).rejects.toThrow(new Error('Its not your turn'))

    });

})
