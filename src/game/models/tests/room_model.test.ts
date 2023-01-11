import { GameController } from "@/game/controllers/game_controller";
import RoomController from "@/game/controllers/room_controller";
import GameCache from "@/service/game_cache";
import { ElementTypes } from "../elements/elements";
import { RoomModel, RoomModelMap } from "../room";
import { UserModel } from "../user";


describe('RoomModelMap', () => {
    it('toDomain: should return a Room model with all models mapped from a json string', async () => {
        const room: RoomModel = new RoomModel(4);
        const room_controller: RoomController = new RoomController(room, GameCache);

        const user1: UserModel = new UserModel();
        const user2: UserModel = new UserModel();
        const user3: UserModel = new UserModel();
        const user4: UserModel = new UserModel();

        user1.name = "Test1";
        user2.name = "Test2";
        user3.name = "Test3";
        user4.name = "Test4";
        room_controller.addUser(user1);
        room_controller.addUser(user2);
        room_controller.addUser(user3);
        room_controller.addUser(user4);

        expect(await room_controller.gameStart()).toBe(true);

        const game_controller: GameController = new GameController(room.game);
        room.game.drawType = 'selectable'
        game_controller.drawingElements([ElementTypes.Fire, ElementTypes.Water, ElementTypes.Earth]);
        game_controller.placeElement(ElementTypes.Fire, {row: 0, column: 0})
        game_controller.placeElement(ElementTypes.Water, {row: 1, column: 0})
        game_controller.placeElement(ElementTypes.Earth, {row: 2, column: 0})
        game_controller.endOfPlayerTurn();

        game_controller.drawingElements([ElementTypes.Wind]);
        game_controller.placeElement(ElementTypes.Wind, {row: 0, column: 3});
        game_controller.endOfPlayerTurn();

        const room_map: RoomModelMap = new RoomModelMap()
        const stringified: string = room_map.toDao(room);

        const obj: Object = JSON.parse(stringified);

        const load_room: RoomModel = room_map.toDomain(obj);

        expect(load_room).toStrictEqual(room);
    });
})
