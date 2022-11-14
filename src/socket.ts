import { Server } from "socket.io";
const http = require('http');
import { Express } from 'express';

class Socket {
   static init(app: Express) {
    const server = http.createServer(app);

    const io = new Server(server);
    
    io.on("connection", (socket) => {
        console.log("·wdqw")
        // socket.on("end", (datos) => {
        //     // ...datos.idPrtida
        //     socket.emit("noArg")
        //     io.to(datos.iDpartida).emit("board");
        //   });
        // socket.on("moverElement", () => {
        //     // ... mover elemtn
        //     socket.emit("noArg");
        //   });
    
        // socket.on("moverElemdwent", () => {
        //     // ... mover elemtn
        //     socket.emit("noArg");
        //   });
    })
  }

    private onConnection() {
    
  }
}

export default Socket;

