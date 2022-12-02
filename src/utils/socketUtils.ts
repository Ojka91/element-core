import { ElementTypes } from "@/game/models/elements/elements";
import { IPlayerModel } from "@/game/models/player";
import { RoomModel } from "@/game/models/room";
import { Position } from "@/game/utils/position_utils";
import { Reaction } from "@/schemas/player_actions";
import { PrivateServerResponse, PublicServerResponse } from "../schemas/server_response";

export interface ServerToClientEvents {
  error: (response: PrivateServerResponse) => void;
  gameUpdate: (response: PublicServerResponse) => void;
}

export interface ClientToServerEvents {
  onQueue: (queue: Queue) => void;
  joinGame: (data: JoinGame) => void;
  endTurn: (data: EndTurn) => void;
  drawElements: (data: DrawElements) => void;
  placeElement: (data: PlaceElement) => void;
  moveSage: (data: MoveSage) => void;
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

export type JoinGame = {
  roomId: string
}

export type EndTurn = {
  roomId: string,
  room: RoomModel
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