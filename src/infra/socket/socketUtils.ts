import { ElementTypes } from "@/domain/game/models/elements/elements";
import { UserModel } from "@/domain/game/models/user";
import { Position } from "@/domain/game/utils/position_utils";
import { Reaction } from "@/infra/schemas/player_actions";
import { PrivateServerResponse, PublicServerResponse } from "@/infra/schemas/server_response";

export interface ServerToClientEvents {
  error: (response: PrivateServerResponse | null) => void;
  gameUpdate: (response: PublicServerResponse | null) => void;
  gameFound: (response: GameFound) => void;
  chat: (response: ChatServerToClient) => void;
  userAuthData: (response: UserAuthData) => void;
  currentUsersConnected: (response: UsersConnectedCount) => void;

  // Testing porpouses
  boardMovement: (response: {}) => void;
  testUpdate: (response: {}) => void;
}

export interface ClientToServerEvents {
  onQueue: (queue: Queue) => void;
  cancelQueue: (queue: Queue) => void;
  joinGame: (data: JoinGameData) => void;
  endTurn: (data: EndTurnData) => void;
  drawElements: (data: DrawElementsData) => void;
  placeElement: (data: PlaceElementData) => void;
  moveSage: (data: MoveSageData) => void;
  chat: (data: ChatClientToServer) => void;
  forfeit: (data: ForfeitData) => void;
  forceGameUpdate: () => void;

  // Testing porpouses
  joinRoom: (data: any) => void;
  triggerFromClient: (data: any) => void;
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

export type JoinGameData = {
  roomId: string
  username: string
}

export type EndTurnData = {
  roomId: string
}

export type DrawElementsData = {
  roomId: string
  numOfElements: number
}

export type PlaceElementData = {
  roomId: string
  element: ElementTypes
  position: Position
  reaction?: Reaction
}

export type MoveSageData = {
  roomId: string
  playerId: string
  position: Position
}

export type ChatClientToServer = {
  roomId: string,
  message: string
}

export type ChatServerToClient = {
  user: UserModel,
  message: string
}
export type UserAuthData = {
  userUuid: string,
  roomUuid: string
}

export type ForfeitData = {
  roomId: string,
  userId: string
}

export type UsersConnectedCount = {
  currentUsersCount: number
}