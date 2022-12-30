import { ElementPieceCreator, SagePieceCreator } from "@/game/models/pieces_factory";
import { Reaction, WaterReaction } from "@/schemas/player_actions";
import { PositionUtils, Position } from "@/game/utils/position_utils";
import { BoardModel } from "../models/board";
import { IGridModel } from "../models/grid";
import { ISageModel, SageModel } from "../models/pieces/sage";
import { SageController } from "./pieces/sage_controller";
import ElementPoolManager from "./element_pool_controller";
import { ElementModel, ElementTypes, IElementModel } from "../models/elements/elements";
import { GameType } from "../models/game";
import GridController from "./grid_controller";
import { MovementManager } from "./movement_manager";
import { ElementController } from "./elements/elements_controller";
import { IPieceModel } from "../models/pieces/pieces";
import { IPlayerModel } from "../models/player";
import PlayerController from "./player_controller";
import { EarthController } from "./elements/earth_controller";
import { WaterController } from "./elements/water_controller";
import { FireController } from "./elements/fire_controller";
import { WindController } from "./elements/wind_controller";
import { EarthModel, IEarthModel } from "../models/elements/earth";
import { WaterModel, IWaterModel } from "../models/elements/water";
import { FireModel, IFireModel } from "../models/elements/fire";
import { IWindModel, WindModel } from "../models/elements/wind";


const BOARD_WIDTH: number = 11;
const BOARD_HEIGHT: number = 11;

class BoardController {

    private model: BoardModel;
    private element_pool_manager: ElementPoolManager; 
    private grid_controller: GridController;

    constructor(model: BoardModel) {
        this.model = model;
        this.element_pool_manager = new ElementPoolManager(this.model.elementPool);
        this.grid_controller = new GridController(this.model.grid);
    }

    public returnElementToPool(element: ElementTypes): void {
        this.element_pool_manager.addElement(element);
    }

    public getElementFromPool(element: ElementTypes): void {
        this.element_pool_manager.removeElement(element);
    }

    /** Method to check whether the requested elements can be taken or not */
    public checkElementPoolAvailability(elements: Array<ElementTypes>): boolean {
        return this.element_pool_manager.checkElementListAvailability(elements);
    }

    /** Grid getter */
    public getGrid(): IGridModel {
        return this.model.grid;
    }

    public initBoard(): void {
        this.grid_controller.generateInitialGrid(BOARD_WIDTH, BOARD_HEIGHT);
    }

    /** Method to create the sages for the players */
    public createSageByPlayerAndGameType(player: IPlayerModel, game_type: GameType): void {
        const sage: SageModel = new SagePieceCreator().createPieceModel() as SageModel;
        const sage_controller: SageController = new SageController(sage);
        const player_controller: PlayerController = new PlayerController(player);

        sage_controller.updatePosition(sage_controller.getSageInitialPosition(game_type as number, player_controller.getPlayerNumber()));
        player_controller.setSage(sage);
        this.grid_controller.updateGridCell(player_controller.getSage());
        this.model.sage_list.push(sage);
    }

    /** Method to place the player sage in the board */
    public placePlayerSage(player: IPlayerModel, new_position: Position): void {
        let sage = new PlayerController(player).getSage();
        
        if (this.grid_controller.isPositionValid(new_position) == false) {
            throw new Error("Incorrect new row or new column dimensions");
        }
        if (MovementManager.isSageMoveValid(this.model.grid, sage.position, new_position) == false) {
            throw new Error("Sage movement is not valid");
        }
        this.grid_controller.clearCell(sage.position);
        new SageController(sage).updatePosition(new_position);
        this.grid_controller.updateGridCell(sage);
    }

    /** Method to place an element in the board */
    public placeElement(element_type: ElementTypes, position: Position): void {

        const element: ElementModel = new ElementPieceCreator(element_type).createPieceModel() as ElementModel
        if (this.grid_controller.isPositionValid(position) == false) {
            throw new Error("Invalid position, outside grid boundaries");
        }
        let element_controller: ElementController;
        switch (element_type) {
            case ElementTypes.Earth:
                element_controller = new EarthController(element as EarthModel);
                break;
            case ElementTypes.Water:
                element_controller = new WaterController(element as WaterModel);
                break;
            case ElementTypes.Fire:
                element_controller = new FireController(element as FireModel);
                break;
            case ElementTypes.Wind:
                element_controller = new WindController(element as WindModel);
                break;
        }

        element_controller.updatePosition(position);

        if (element_controller.place(this.model.grid, position, this.element_pool_manager) == false) {
            throw new Error("Cannot replace the cell due to a rule of replacement")
        }
    }

    public performElementReaction(element_type: ElementTypes, position: Position, reaction?: Reaction): void {
        const element: IElementModel = new ElementPieceCreator(element_type).createPieceModel() as ElementModel
        let element_controller;
        switch (element_type) {
            case ElementTypes.Water:
                element_controller = new WaterController(element as IWaterModel);
                if (reaction != null) {
                    const water_reaction: WaterReaction = reaction as WaterReaction
                    element_controller.reaction(this.model.grid, position, water_reaction.initial_river, water_reaction.new_river, this.element_pool_manager);
                } else {
                    element_controller.reaction(this.model.grid, position);
                }
                break;
            case ElementTypes.Fire:
                element_controller = new FireController(element as IFireModel);
                element_controller.reaction(this.model.grid, position, this.model.elementPool);
                break;
            case ElementTypes.Earth:
                element_controller = new EarthController(element as IEarthModel);
                element_controller.reaction(this.model.grid, position);
                break;
            case ElementTypes.Wind:
                element_controller = new WindController(element as IWindModel);
                element_controller.reaction(this.model.grid, position);
                break;
        }
    }

    public winningCondition(position: Position): string {
        for (let sage of this.model.sage_list) {
            if (PositionUtils.isStrictPosition(sage.position, position)) {
                if (this.isSageCaptured(sage)) {
                    return sage.uuid;
                }
            }
        }
        return "";
    }

    private isSageCaptured(sage: ISageModel): boolean {
        const piece_list: Array<IPieceModel> = this.grid_controller.getSurroundingPieces(sage.position);
        for (let piece of piece_list) {
            if (this.grid_controller.isWindCell(piece.position)) {
                if (MovementManager.isWindBlocked(this.model.grid, sage.position, piece as WindModel) == false) {
                    return false;
                }
            }
            if (MovementManager.isSageMoveValid(this.model.grid, sage.position, piece.position)) {
                return false;
            }
        }
        return true;
    }

    public displayGrid(): void {
        this.grid_controller.displayGrid();
    }

}

export default BoardController;