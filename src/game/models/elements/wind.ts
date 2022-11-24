import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { Earth } from "./earth";
import { Element } from "./elements";

const MAX_STACKED_WINDS: number = 4;

/**
 * Wind class
 * @brief   Wind allows the sage to jump through the piece.
 *          Jumping thorugh Wind can be performed both diagonally and orthogonally
 *          Wind can replace Earth elements but NEVER replace Mountains.
 *          Stacking two Wind elements in the same piece will upgrade the element to Whirlwind
 */
 export class Wind extends Element{
    private stacked_winds: number = 1;

    constructor(){
        super();
    }

    // Override parent method
    public place(grid: Grid, cell: Position): boolean {
        const piece: Piece = grid.getGridCellByPosition(cell);
        this.position = cell;
        if(piece instanceof Wind){
            if(piece.isMaxWhirlwind() == false){
                this.stacked_winds = (piece as Wind).getNumberOfStackedWinds() + 1;
                grid.updateGridCell(this);
                return true;
            } else {
                return false;
            }
        }
        if(grid.isPositionEmpty(cell) || (this.ruleOfReplacement(piece))){
            grid.updateGridCell(this);
            return true;
        }
        return false;
    }

    public isMaxWhirlwind(): boolean {
        return this.stacked_winds == MAX_STACKED_WINDS;
    }

    public increaseStackedWinds(): void {
        if(this.stacked_winds < MAX_STACKED_WINDS){
            this.stacked_winds++;
        }
    }

    public getNumberOfStackedWinds(): number {
        return this.stacked_winds;
    }

    public ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Earth){
            if(piece_to_replace.isMountain() || piece_to_replace.isRange()){
                return false;
            }
            return true;
        } else if (piece_to_replace instanceof Wind){
            return !this.isMaxWhirlwind()
        }
        return false;
    }

    public reaction(grid: Grid, cell: Position): void {
        /*const piece: Piece = grid.getGridCellByPosition(cell);
        if(grid.isWindCell(cell)){
            if(this.ruleOfReplacement(piece as Wind)){
                (piece as Wind).increaseStackedWinds();
                grid.updateGridCell(piece)
            }
        } else if (grid.isEarthCell(cell)){
            if(this.ruleOfReplacement(piece as Earth)){
                const wind: Wind = new Wind();
                wind.updatePosition(cell);
                grid.updateGridCell(wind);
            }
        }*/
        return;
    }
}
