import { User } from "@/game/models/user";
import { GameType } from "../game_utils";
import Player from "../player";
import Room from "../room";


describe('Room', () => {
    it('addUser: user should be added to the user list map ', async () => {
        const room: Room = new Room(GameType.TwoPlayersGame);
        const user: User = new User("Ark");
        
        const result = room.addUser(user);
        expect(result).toBe(true);

        expect(room.getUserList().length==0).toBe(false)
    });

    it('addUser: there cannot be identical users in same room ', async () => {
        const room: Room = new Room(GameType.TwoPlayersGame);
        const user: User = new User("Ark");
        
        const result = room.addUser(user);
        expect(result).toBe(true);
        
        expect( () => { room.addUser(user);}).toThrow("The same user cannot be in the Room twice");

    });

    it('addUser: cannot add more users on a full room ', async () => {
        const room: Room = new Room(GameType.TwoPlayersGame);
        const user: User = new User("Ark");
        
        const user4: User = new User("Ark4");
        const user1: User = new User("Ark1");
        const user2: User = new User("Ark2");
        const user3: User = new User("Ark3");
        
        room.addUser(user1);
        room.addUser(user2);
        room.addUser(user3);
        room.addUser(user4);
        const result = room.addUser(user);
        expect(result).toBe(false);

    });


    it('isRoomFull: should return true if room has 4 players, false otherwise ', async () => {
        const room: Room = new Room(GameType.TwoPlayersGame);
        const user4: User = new User("Ark4");
        const user1: User = new User("Ark1");
        const user2: User = new User("Ark2");
        const user3: User = new User("Ark3");
        
        room.addUser(user1);
        expect(room.isRoomFull()).toBe(false);
        room.addUser(user2);
        room.addUser(user3);
        room.addUser(user4);

        expect(room.isRoomFull()).toBe(true);
    });

    it('getUserList: should return an array of the user added to the room ', async () => {
        const room: Room = new Room(GameType.FourPlayersGame);
        const user4: User = new User("Ark4");
        const user1: User = new User("Ark1");
        const user2: User = new User("Ark2");
        const user3: User = new User("Ark3");
        
        expect(room.getUserList().length == 0).toBe(true);
        expect(room.addUser(user1)).toBe(true);
        expect(room.addUser(user2)).toBe(true);
        expect(room.addUser(user3)).toBe(true);
        expect(room.addUser(user4)).toBe(true);
        expect(room.getUserList().length == 4).toBe(true);
    });

    it('addUser and gameStart: should not let add more user than allowed to the room and game should start ', async () => {
        const game_type: GameType = GameType.TwoPlayersGame;
        const room: Room = new Room(game_type);
        const user4: User = new User("Ark4");
        const user1: User = new User("Ark1");
        const user2: User = new User("Ark2");
        const user3: User = new User("Ark3");
        
        expect(room.gameStart()).toBe(false)
        expect(room.addUser(user1)).toBe(true);
        expect(room.gameStart()).toBe(false)
        expect(room.addUser(user2)).toBe(true);
        expect(room.gameStart()).toBe(true);
        expect(room.addUser(user3)).toBe(false);
    });
})
  