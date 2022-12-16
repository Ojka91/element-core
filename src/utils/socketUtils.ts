import { ElementTypes } from "@/game/models/elements/elements";
import { IPlayerModel } from "@/game/models/player";
import { RoomModel } from "@/game/models/room";
import { Position } from "@/game/utils/position_utils";
import { Reaction } from "@/schemas/player_actions";
import { PrivateServerResponse, PublicServerResponse } from "../schemas/server_response";

export interface ServerToClientEvents {
  error: (response: PrivateServerResponse | null) => void;
  gameUpdate: (response: PublicServerResponse | null) => void;
  gameFound: (response: GameFound) => void;
  chat: (response: ChatServerToClient) => void;
  
  // Testing porpouses
  boardMovement: (response: {}) => void;
  testUpdate: (response: {}) => void;
}

export interface ClientToServerEvents {
  onQueue: (queue: Queue) => void;
  cancelQueue: (queue: Queue) => void;
  joinGame: (data: JoinGame) => void;
  endTurn: (data: EndTurn) => void;
  drawElements: (data: DrawElements) => void;
  placeElement: (data: PlaceElement) => void;
  moveSage: (data: MoveSage) => void;
  chat: (data: ChatClientToServer) => void;

  // Testing porpouses
  joinRoom: (data: any) => void;
  triggerFromClient: (data: any) => void;
  forceGameUpdate: (data: any) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {

}

export enum Queue {
  queue2 = 'queue2',
  queue3 = 'queue3',
  queue4 = 'queue4'
}

export type GameFound = {
  roomId: string
}

export type JoinGame = {
  roomId: string
}

export type EndTurn = {
  roomId: string
}

export type DrawElements = {
  roomId: string
  elements: Array<ElementTypes>
}

export type PlaceElement = {
  roomId: string
  element: ElementTypes
  position: Position
  reaction?: Reaction
}

export type MoveSage = {
  roomId: string
  player: IPlayerModel
  position: Position
}

export type ChatClientToServer = {
  roomId: string,
  message: string
}

export type ChatServerToClient = {
  message: string
}