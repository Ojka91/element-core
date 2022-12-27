import { PlayerModel } from "@/game/models/player";
import { RoomModel } from "@/game/models/room";
import { UserModel } from "@/game/models/user";
import GameCache from "../../../service/game_cache";
import RoomController from "../room_controller";

describe('RoomController', () => {
    it('addUser: user should be added to the user list map ', async () => {
        const room: RoomModel = new RoomModel(3);
        const room_controller: RoomController = new RoomController(room, GameCache);
        const user: UserModel = new UserModel();
        user.name = "test"

        const result = room_controller.addUser(user);
        expect(result).toBe(true);

        expect(room_controller.getUserList().length == 0).toBe(false)
    });

    it('addUser: there cannot be identical users in same room ', async () => {
        const room: RoomModel = new RoomModel(3);
        const room_controller: RoomController = new RoomController(room, GameCache);
        const user: UserModel = new UserModel();
        user.name = "test"

        const result = room_controller.addUser(user);
        expect(result).toBe(true);

        expect(() => { room_controller.addUser(user); }).toThrow("The same user cannot be in the Room twice");

    });

    it('addUser: cannot add more users on a full room ', async () => {
        const room: RoomModel = new RoomModel(4);
        room.size = 4;
        const room_controller: RoomController = new RoomController(room, GameCache);
        const user: UserModel = new UserModel();
        user.name = "test"

        const user1: UserModel = new UserModel();
        const user2: UserModel = new UserModel();
        const user3: UserModel = new UserModel();
        const user4: UserModel = new UserModel();

        user1.name = "Test1";
        user2.name = "Test2";
        user3.name = "Test3";
        user3.name = "Test4";

        expect(room_controller.addUser(user1)).toBe(true);
        expect(room_controller.addUser(user2)).toBe(true);
        expect(room_controller.addUser(user3)).toBe(true);
        expect(room_controller.addUser(user4)).toBe(true);
        expect(room_controller.addUser(user)).toBe(false);

    });


    it('isRoomFull: should return true if room is full, false otherwise ', async () => {
        const room: RoomModel = new RoomModel(2);
        room.size = 2;
        const room_controller: RoomController = new RoomController(room, GameCache);

        const user1: UserModel = new UserModel();
        const user2: UserModel = new UserModel();
        user1.name = "Test1";
        user2.name = "Test2";

        expect(room_controller.isRoomFull()).toBe(false);
        expect(room_controller.addUser(user1)).toBe(true);
        expect(room_controller.isRoomFull()).toBe(false);
        expect(room_controller.addUser(user2)).toBe(true);
        expect(room_controller.isRoomFull()).toBe(true);
    });

    it('getUserList: should return an array of the user added to the room ', async () => {
        const room: RoomModel = new RoomModel(2);
        room.size = 2;
        const room_controller: RoomController = new RoomController(room, GameCache);

        const user1: UserModel = new UserModel();
        const user2: UserModel = new UserModel();
        user1.name = "Test1";
        user2.name = "Test2";

        expect(room_controller.getUserList().length == 0).toBe(true);
        expect(room_controller.addUser(user1)).toBe(true);
        expect(room_controller.addUser(user2)).toBe(true);
        expect(room_controller.getUserList().length == 2).toBe(true);
    });

    it('addUser and gameStart: should not let add more user than allowed to the room and game should start ', async () => {
        const room: RoomModel = new RoomModel(2);
        const room_controller: RoomController = new RoomController(room, GameCache);

        const user1: UserModel = new UserModel();
        const user2: UserModel = new UserModel();
        user1.name = "Test1";
        user2.name = "Test2";

        expect(await room_controller.gameStart()).toBe(false);
        expect(room_controller.addUser(user1)).toBe(true);
        expect(await room_controller.gameStart()).toBe(false);
        expect(room_controller.addUser(user2)).toBe(true);
        expect(await room_controller.gameStart()).toBe(true);
    });

    it('getUuid: should return the room uuid ', async () => {
        const room: RoomModel = new RoomModel(2);
        const room_controller: RoomController = new RoomController(room, GameCache);

        expect(room_controller.getUuid()).toStrictEqual(room.uuid);
    })

    it('getGame: should return the game model ', async () => {
        const room: RoomModel = new RoomModel(2);
        const room_controller: RoomController = new RoomController(room, GameCache);

        expect(room_controller.getGame()).toStrictEqual(room.game);
    })

    it('loadRoomById: should load the room model ', async () => {
        const room: RoomModel = new RoomModel(2);
        const room_controller: RoomController = new RoomController(room, GameCache);

        jest.spyOn(GameCache, 'loadRoom').mockResolvedValue(room);
        expect(await room_controller.loadRoomById("") == null).toBe(true)
        jest.restoreAllMocks();
    })

    it('getPlayerIdByUserId: should return an array of the user added to the room ', async () => {
        const room: RoomModel = new RoomModel(2);
        room.size = 2;
        const room_controller: RoomController = new RoomController(room, GameCache);

        const user1: UserModel = new UserModel();
        const user2: UserModel = new UserModel();
        user1.name = "Test1";
        user1.socket_id = "socket"
        user2.name = "Test2";
        user2.socket_id = "socket1"

        expect(() => room_controller.getPlayerBySocketId(user1.socket_id)).toThrow("User ID not found");
        expect(room_controller.addUser(user1)).toBe(true);
        expect( room_controller.getPlayerBySocketId(user1.socket_id) instanceof PlayerModel).toBe(true);
    });


})
