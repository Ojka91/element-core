import { Server } from "socket.io";
import { GameController } from "./game/game_controller";
import Room from "./game/models/room";
import { QueueController } from "./game/queue_controller";
import { User } from "./game/user";

export enum queue {
  queue2 = 'queue2',
  queue3 = 'queue3',
  queue4 = 'queue4'
}

export type JoinQueue = {
  queue: queue
}
export type JoinGame = {
  roomId: string
}

/**
 * This class is reponsible to mantain socket connection and logic between players and server when game begins
 */
class Socket {
    private io: any;
    private gameController: GameController;

    constructor(server: any) {
      this.io = new Server(server)
      this.gameController = new GameController();
    }
  public init() {
    
    const queueController = new QueueController();

    this.io.on("connection", (socket: any) => {

      console.log("user connected")
        
      /**
       * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
       * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
       * 2. We should check if there are enough players on queue room to start a game
       * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
       */
      socket.on("onQueue", async (data: JoinQueue) => {
        console.log(data.queue)

        // 1. Client join queue room
        socket.join(data.queue)

        // 2. Checking if that queue have enough players
        if(queueController.isQueueFull(data)) {
          // 2.1 Creating and saving new room
          let room = new Room();
          await this.gameController.saveRoom(room);
          // 2.1 Sending roomId to client for them to join
          this.io.to(data.queue).emit('gameFound', {roomId: room.getUuid});
          // 2.1 Cleaning queue room from those players that found the game !! This system may fail if we have a lot of concurrency, we may change it in the future
          this.io.socketsLeave(data.queue);
        }

      })

      /**
       * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
       * 1. Client should join game/roomId socket and as user on the game room
       * 2. We check if all players have joined or we are still waiting for someone to join
       * 2.1 If so, we start the game
       */
      socket.on("joinGame", async (data: JoinGame) => {
        console.log(data.roomId)

        // 1. Join game/roomId socket
        socket.join(data.roomId)
        // 1. Join user into the game room
        let room: Room = await this.gameController.loadRoom(data.roomId);
        room.addUser(new User(socket.id)); // Username is socketid

        // 2. Checking if room is full so game can start
        if(room.isRoomFull()) { // TBD TODO !!! we have no way to check if the room is created for 2, 3 or 4 players yet! should we implement it??!
          // 2.1 Starting game
          await this.gameController.gameStart(room); // TODO Which one????
          room.gameStart(); // TODO Which one????

          // 2.1 We emit a game update for the clients to start playing
          this.io.to(data.roomId).emit('gameUpdate', room); // TODO TBD My proposal is to use the event "gameUpdate" each time a player does something. So client...
          //... will have to listen to 'gameUpdate' and react accordingly
        } 

      })


      // From here below, testing only
      socket.on("joinRoom", (data: any) => {
        /**
         * Testing porpouses
         * When client triggers this event, client will join data1
         */
        socket.join('room1')
        console.log(data)
      })

      socket.on("triggerFromClient", (data: any) => {
        /**
         * Testing porpouses
         * When client triggers this event, an event is sent to the room1 under boardMovement event
         */
        this.io.to("room1").emit('boardMovement', {board: 'new'});
        console.log(data)
      })

      socket.on("disconnect", (socket: any) => {
        console.log("client disconnected")
  
       })

    })

  }

  public emmitRoom() {
    this.io.to("room1").emit('something', {some: 'data'});
  }
}

export default Socket;

