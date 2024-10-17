import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@/infra/socket/socketUtils";
import { Server, Socket } from "socket.io";

export type InputSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type SocketIo = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;