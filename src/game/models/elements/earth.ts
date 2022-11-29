import Grid, { Position } from "../grid";
import { Piece } from "../pieces";
import { PositionUtils, AxisIncrement } from "../position_utils";
import { Element } from "./elements";
import { Water } from "./water";


const all_direction_map: Map<string, AxisIncrement> = PositionUtils.all_direction_increment_map;

/**
 * Earth class
 * @brief   Earth blocks the sage to move.
 *          Stacking two Earth's it becomes a Mountain. 
 *          Water elements can be replaced by Earth.
 *          Earth elements can be replaced by Wind unless they became a Mountain.
 *          Any Earth connected orthogonally or diagonally to a Mountain
 *          become a Range and share the same properties as a Mountain.
 *          A Range blocks the Sage to move diagonally.
 */
 export class Earth extends Element{
    private is_mountain: boolean = false;
    private is_range: boolean = false;

    constructor(){
        super();
    }

    // Override parent method
    public place(grid: Grid, cell: Position): boolean {
        const piece: Piece = grid.getGridCellByPosition(cell);
        this.position = cell;
        if(piece instanceof Earth){
            if (piece.isMountain() == false){
                this.promoteToMountain();
                grid.updateGridCell(this)
                this.formRange(grid, cell);
                return true;
            } else {
                return false;
            }
        }
        if(grid.isPositionEmpty(cell) || (this.ruleOfReplacement(piece))){
            grid.updateGridCell(this)
    
            return true;
        }
        return false;
    }

    public isMountain(): boolean {
        return this.is_mountain;
    }

    public isRange(): boolean {
        return this.is_range;
    }

    public promoteToRange(): void {
        this.is_range = true;
    }

    public promoteToMountain(): void {
        this.is_mountain = true;
        this.promoteToRange();
    }

    public ruleOfReplacement(piece_to_replace: Piece): boolean {
        if(piece_to_replace instanceof Water){
            return true;
        } 
        if (piece_to_replace instanceof Earth){
            if (this.is_mountain == false){
                return true;
            }
        }
        return false;
    }

    public reaction(grid: Grid, cell: Position): void {
        /*const piece: Piece = grid.getGridCellByPosition(cell);
        if(this.ruleOfReplacement(piece)){
            if(grid.isWaterCell(cell)){
                const earth: Earth = new Earth();
                earth.updatePosition(cell);
                grid.updateGridCell(earth);
            } else if ( (grid.isEarthCell(cell)) && (grid.isMountainCell(cell)==false)){
                (piece as Earth).promoteToMountain();
                this.formRange(grid, cell);
            }
            
        }
        */
    }

    private formRange(grid: Grid, cell: Position){

        // In this array are stored all the surrounding Earths of the evaluated earth position
        let surrounding_earths: Array<Position> = this.getSurroundingEarths(grid, cell);

        // Until there are surrounding earths to evaluate
        while(surrounding_earths.length != 0){
            let next_surrounding_earths: Array<Position> = [];
            surrounding_earths.forEach((earth_pos: Position) => {
                const earth: Earth = grid.getGridCellByPosition(earth_pos) as Earth;
                earth.promoteToRange();
                
                next_surrounding_earths = next_surrounding_earths.concat(earth.getSurroundingEarths(grid, earth_pos));

            });
            surrounding_earths = next_surrounding_earths;
        }
        
    }
    
    private getSurroundingEarths(grid: Grid, cell: Position): Array<Position> {
        let surrounding_earths: Array<Position> = [];
        let evaluation_cell: Position;

        all_direction_map.forEach((value: AxisIncrement, key: string) => {
            evaluation_cell = {
                row: cell.row + value.y,
                column: cell.column + value.x
            };
            if(grid.isPositionValid(evaluation_cell) && grid.isEarthCell(evaluation_cell) && (grid.isRangeCell(evaluation_cell) == false)){
                surrounding_earths.push(evaluation_cell);
            }
        })

        return surrounding_earths;
    }
}
