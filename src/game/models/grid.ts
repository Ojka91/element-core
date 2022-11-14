import { Piece } from "./pieces";
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
}

export default Grid;