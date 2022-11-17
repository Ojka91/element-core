import { Server } from "socket.io";

/**
 * This class is reponsible to mantain socket connection and logic between players and server when game begins
 */
class Socket {
    private io: any;

    constructor(server: any) {
      this.io = new Server(server)
    }
  public init() {
    
    this.io.on("connection", (socket: any) => {

      console.log("user connected")


       socket.on("onQueue", (data: any) => {
        console.log(data)
        /**
         * When client enters on onQueue it joins queue room
         * (in a future we may add queue2 and queue4 for different 2 players game and 4 players game)
         */
        socket.join('queue')

        /**
         * We should check now if there are enough players on queue room to start a game
         * If so, we should make thos players join new room (gameID), and leave queue room
         */
      })

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

