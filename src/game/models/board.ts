import { Grid, Position } from "./grid";
import { Element, ElementTypes } from "./elements/elements";
import ElementPoolManager from "./element_pool_manager";
import Player from "./player";
import { MovementManager } from "./movement_manager";
import { Piece, Sage } from "./pieces/pieces";
import { ElementPieceCreator, SagePieceCreator } from "./pieces_factory";
import { GameType } from "./game_utils";
import { Water } from "./elements/water";
import { Fire } from "./elements/fire";
import { Reaction, WaterReaction } from "@/schemas/player_actions";
import { PositionUtils } from "../utils/position_utils";
import { Wind } from "./elements/wind";

const COLUMN_PIECES_WIDTH: number = 11;
const ROW_PIECES_HEIGHT: number = 11;

export class BoardModel {

    grid: Grid = new Grid(ROW_PIECES_HEIGHT, COLUMN_PIECES_WIDTH);
    sage_list: Array<Sage> = [];
    elementPool: ElementPoolManager = new ElementPoolManager();
}