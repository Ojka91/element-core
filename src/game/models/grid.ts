import { Earth } from "./elements/earth";
import { Fire } from "./elements/fire";
import { Water } from "./elements/water";
import { Wind } from "./elements/wind";
import { Empty, Piece } from "./pieces";
import { EmptyPieceCreator } from "./pieces_factory";

export type Position = {
    row: number,
    column: number
};

export class Grid {

    private cells: Piece[][] = [];
    private width: number = 0;
    private height: number = 0;

    constructor(width: number, height: number) {
        this.cells = this.generateInitialGrid(width, height)
        this.width = width
        this.height = height
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    public updateGridCell(piece: Piece): void {
        this.cells[piece.position.row][piece.position.column] = piece;
    }

    public getGridCellByPosition(position: Position): Piece {
        return this.cells[position.row][position.column];
    }

    public displayGrid(): void {
        for (var row of this.cells){
            for (var column of row){
                console.log(column);
            }
        }
    }

    private generateInitialGrid(width: number, height: number): Piece[][] {
        let cells: Piece[][] = new Array(height);
        for (let row = 0; row < height; row++) {
            cells[row] = new Array(width);
            for (let col = 0; col < width; col++){
                const new_position: Position = {row: row, column: col};
                
                let new_piece = new EmptyPieceCreator().createPiece();
                new_piece.updatePosition(new_position);
                cells[row][col] = new_piece;
            }
        }
        return cells;
    }

    /** Check whether the position is inside the grid boundaries */
    public isPositionValid(new_position: Position){
        return (this.getWidth() > new_position.column) &&
        (0 <= new_position.column) &&
        (0 <= new_position.row) &&
        (this.getHeight() > new_position.row);
    }

    /** Check whether the position is empty
     * return: true if empty, false otherwise
     */
    public isPositionEmpty(new_position: Position): boolean {
        return this.getGridCellByPosition(new_position) instanceof Empty;
    }

    
    /** Check whether the position is fire
     * return: true if empty, false otherwise
     */
     public isFireCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof Fire;
    }

    /** Check whether the position is earth
     * return: true if empty, false otherwise
     */
     public isEarthCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof Earth;
    }

    /** Check whether the position is water
     * return: true if empty, false otherwise
     */
     public isWaterCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof Water;
    }

    
    /** Check whether the position is wind
     * return: true if empty, false otherwise
     */
    public isWindCell(position: Position): boolean {
        return this.getGridCellByPosition(position) instanceof Wind;
    }

    /** Check whether the position is whirlwind
     * return: true if empty, false otherwise
     */
     public isWhirlwindCell(position: Position): boolean {
        const piece: Piece = this.getGridCellByPosition(position);
        if (piece instanceof Wind){
            return (piece as Wind).getNumberOfStackedWinds() > 1;
        }
        return false;
    }

    /** Check whether the position is a mountain
     * return true if mountain, false otherwise
     */
    public isMountainCell(position: Position): boolean {
        const piece: Piece = this.getGridCellByPosition(position);
        if ( piece instanceof Earth){
            return (piece as Earth).isMountain();
        }
        return false;
    }

    /** Check whether the position is a range
     * return true if mountain, false otherwise
     */
     public isRangeCell(position: Position): boolean {
        const piece: Piece = this.getGridCellByPosition(position);
        if ( piece instanceof Earth){
            return (piece as Earth).isRange();
        }
        return false;
    }
}

export default Grid;