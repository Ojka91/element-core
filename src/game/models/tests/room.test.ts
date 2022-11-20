import { User } from "@/game/user";
import Player from "../player";
import Room from "../room";


describe('Room', () => {
    it('addUser: user should be added to the user list map ', async () => {
        const room: Room = new Room();
        const user: User = new User("Ark");
        
        const result = room.addUser(user);
        expect(result).toBe(true);

        expect(room.getUserList().length==0).toBe(false)

        expect(room.getPlayerByUser(user) instanceof Player).toBe(true);
    });

    it('addUser: there cannot be identical users in same room ', async () => {
        const room: Room = new Room();
        const user: User = new User("Ark");
        
        const result = room.addUser(user);
        expect(result).toBe(true);
        
        expect( () => { room.addUser(user);}).toThrow("The same user cannot be in the Room twice");

    });

    it('addUser: cannot add more users on a full room ', async () => {
        const room: Room = new Room();
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
        const room: Room = new Room();
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
        const room: Room = new Room();
        const user4: User = new User("Ark4");
        const user1: User = new User("Ark1");
        const user2: User = new User("Ark2");
        const user3: User = new User("Ark3");
        
        expect(room.getUserList().length == 0).toBe(true);
        room.addUser(user1);
        room.addUser(user2);
        room.addUser(user3);
        room.addUser(user4);
        expect(room.getUserList().length == 4).toBe(true);
    });

    it('gameStart: should throw error if there is less than 2 users in the room ', async () => {
        const room: Room = new Room();
        const user4: User = new User("Ark4");
        const user1: User = new User("Ark1");
        const user2: User = new User("Ark2");
        const user3: User = new User("Ark3");
        
        expect(()=>{room.gameStart()}).toThrow("To start a game it's required at least 2 players")
        room.addUser(user1);
        expect(()=>{room.gameStart()}).toThrow("To start a game it's required at least 2 players")
        room.addUser(user2);
        expect(room.gameStart() == null).toBe(true);
    });
})
  