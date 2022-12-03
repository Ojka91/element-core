import { Queue } from "@/utils/socketUtils";
import { GameController } from "../controllers/game_controller";
import RoomController from "../controllers/room_controller";
import { GameService } from "../game_service";
import { BoardModel } from "../models/board";
import { ElementTypes } from "../models/elements/elements";
import { GameModel } from "../models/game";
import { PlayerModel } from "../models/player";

jest.mock('../controllers/room_controller')
jest.mock('../controllers/game_controller')
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
       expect(RoomController.prototype.loadRoom).toHaveBeenCalledTimes(1)
       expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
       expect(RoomController.prototype.getUuid).toHaveBeenCalledTimes(1)

    });

    it('Client should join game', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'getUuid').mockReturnValueOnce('uuid')
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(RoomController.prototype, 'isRoomFull').mockReturnValueOnce(false)
        jest.spyOn(RoomController.prototype, 'gameStart').mockResolvedValueOnce(true)
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            board: new BoardModel(),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        let response = await gameService.joinGame('123', '1234')
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(response).toBe(null);

        jest.spyOn(RoomController.prototype, 'isRoomFull').mockReturnValueOnce(true)
        response = await gameService.joinGame('123', '1234')
        expect(response).toMatchObject({
            room_uuid: 'roomUUID',
            board: new BoardModel(),
            player_turn_uuid: 'playerUUID'
        });
    });

    it('Should endTurn', async () => {
        jest.spyOn(RoomController.prototype, 'loadRoomById').mockResolvedValue()
        jest.spyOn(RoomController.prototype, 'getGame').mockReturnValue(new GameModel())
        jest.spyOn(RoomController.prototype, 'save').mockResolvedValueOnce()
        jest.spyOn(GameController.prototype, 'endOfPlayerTurn').mockReturnValue()
        jest.spyOn(GameService.prototype, 'preparePublicResponse').mockReturnValue({
            room_uuid: 'roomUUID',
            board: new BoardModel(),
            player_turn_uuid: 'playerUUID'
        })

       const gameService = new GameService();
       const response = await gameService.endTurn('uuid');
       expect(response).toMatchObject({
        room_uuid: 'roomUUID',
        board: new BoardModel(),
        player_turn_uuid: 'playerUUID'
    });
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
            board: new BoardModel(),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        let response = await gameService.drawElements('roomId', [ElementTypes.Earth], 'socketId');
        expect(response).toMatchObject({
            room_uuid: 'roomUUID',
            board: new BoardModel(),
             player_turn_uuid: 'playerUUID'
        }); 
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.drawingElements).toHaveBeenCalledTimes(1)

        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(false)

        expect(async () => {
            await gameService.drawElements('roomId', [ElementTypes.Earth], 'socketId')
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
            board: new BoardModel(),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        let response = await gameService.placeElement('roomId', 'socketId', ElementTypes.Earth, {row: 1, column: 3});
        expect(response).toMatchObject({
            room_uuid: 'roomUUID',
            board: new BoardModel(),
             player_turn_uuid: 'playerUUID'
        }); 
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.placeElement).toHaveBeenCalledTimes(1)

        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(false)

        expect(async () => {
            await gameService.drawElements('roomId', [ElementTypes.Earth], 'socketId')
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
            board: new BoardModel(),
            player_turn_uuid: 'playerUUID'
        })

        const gameService = new GameService();
        let response = await gameService.moveSage('roomId', 'socketId', new PlayerModel(2), {row: 1, column: 3});
        expect(response).toMatchObject({
            room_uuid: 'roomUUID',
            board: new BoardModel(),
             player_turn_uuid: 'playerUUID'
        }); 
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1)
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1)
        expect(GameController.prototype.movePlayerSage).toHaveBeenCalledTimes(1)

        jest.spyOn(GameService.prototype, 'isPlayerTurn').mockReturnValue(false)

        expect(async () => {
            await gameService.drawElements('roomId', [ElementTypes.Earth], 'socketId')
        }).rejects.toThrow(new Error('Its not your turn'))

    });
  
})
  