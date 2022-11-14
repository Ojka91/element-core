import { Server } from "socket.io";
class Socket {
  static init(server: any) {
    const io = new Server(server);
    
    io.on("connection", (socket) => {
      console.log("·wdqw")
      socket.on("disconnecting", (reason) => {
        console.log("Client disconnected")
       })
    })

    io.on("disconnect", (socket) => {
        console.log("user disconnected")
  
    })
  }
}

export default Socket;

