import { Grid, Position } from "./grid";
import { Element, ElementTypes } from "./elements/elements";
import ElementPoolManager from "./element_pool_manager";
import Player from "./player";
import { MovementManager } from "./movement_manager";
import { Piece, Sage } from "./pieces";
import { ElementPieceCreator, SagePieceCreator } from "./pieces_factory";
import { GameType } from "./game_utils";
import { Water } from "./elements/water";
import { Fire } from "./elements/fire";
import { Reactions } from "@/schemas/player_actions";
import { PositionUtils } from "./position_utils";
import { Wind } from "./elements/wind";

const COLUMN_PIECES_WIDTH: number = 11;
const ROW_PIECES_HEIGHT: number = 11;

class Board {

    private grid: Grid = new Grid(ROW_PIECES_HEIGHT, COLUMN_PIECES_WIDTH);
    private sage_list: Array<Sage> = [];
    public elementPool: ElementPoolManager = new ElementPoolManager();


    public returnElementToPool(element: ElementTypes): void {
        this.elementPool.addElement(element);
    }

    public getElementFromPool(element: ElementTypes): void {
        this.elementPool.removeElement(element);
    }

    /** Method to check whether the requested elements can be taken or not */
    public checkElementPoolAvailability(elements: Array<ElementTypes>): boolean {
        return this.elementPool.checkElementsAvailability(elements);
    }

    /** Grid getter */
    public getGrid(): Grid {
        return this.grid;
    }

    /** Method to create the sages for the players */
    public createSageByPlayerAndGameType(player: Player, game_type: GameType): void {
        const sage: Sage = new SagePieceCreator().createPiece() as Sage;
        sage.updatePosition(Sage.initial_position_map.get(game_type)!.get(player.getPlayerNumber())!)
        player.setSage(sage);
        this.grid.updateGridCell(player.getSage());
        this.sage_list.push(sage);
    }

    /** Method to place the player sage in the board */
    public placePlayerSage(player: Player, new_position: Position): void {
        let sage = player.getSage();
        if (this.grid.isPositionValid(new_position) == false){
            throw new Error("Incorrect new row or new column dimensions");
        }
        if(MovementManager.isSageMoveValid(this.grid, sage.position, new_position) == false){
            throw new Error("Sage movement is not valid");
        }
        sage.updatePosition(new_position);
        this.grid.updateGridCell(sage);
    }

    /** Method to place an element in the board */
    public placeElement(element_type: ElementTypes, position: Position, reactions?: Reactions): void {
        const cell_piece: Piece = this.grid.getGridCellByPosition(position);
        const element: Element = new ElementPieceCreator(element_type).createPiece() as Element
        element.updatePosition(position);

        if (this.grid.isPositionValid(position) == false){
            throw new Error("Invalid position, outside grid boundaries");
        }
        
        if(this.grid.isPositionEmpty(position) == false){
            if(element.ruleOfReplacement(cell_piece) == false){
                throw new Error("Cannot replace the cell due to a rule of replacement")
            }
        }
        this.grid.updateGridCell(element);

        switch(element_type){
            case ElementTypes.Water:
                (element as Water).reaction(this.grid, position, reactions?.water.initial_river, reactions?.water.new_river);    
                break;
            case ElementTypes.Fire:
                (element as Fire).reaction(this.grid, position, this.elementPool);
                break;
            default:
                element.reaction(this.grid, position);
                break;
        }
    }

    public winningCondition(position: Position): string {
        for(let sage of this.sage_list){
            if(PositionUtils.isStrictPosition(sage.position, position)){
                if(this.isSageCaptured(sage)){
                    return sage.uuid;
                }
            }
        }
        return "";
    }

    private isSageCaptured(sage: Sage): boolean {
        const piece_list: Array<Piece> = this.grid.getSurroundingPieces(sage.position);
        for(let piece of piece_list){
            if(this.grid.isWindCell(piece.position)){
                return MovementManager.isWindBlocked(this.grid, piece.position, piece as Wind);
            }
            if(MovementManager.isSageMoveValid(this.grid, sage.position, piece.position)){
                return false;
            }
        }
        return true;
    }

    public displayGrid(): void {
        this.grid.displayGrid();
    }
    
}

export default Board;