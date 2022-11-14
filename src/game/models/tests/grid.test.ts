import Grid, { Position } from "../grid";
import { SagePieceCreator } from "../pieces_factory";

describe('Grid', () => {
    it('getWidth: ensure the grid width return the creation width', async () => {
        let grid = new Grid(10, 10);
        
        expect(grid.getWidth()==10).toBe(true);
    })

    it('getHeight: ensure the grid width return the creation height', async () => {
        let grid = new Grid(10, 10);
        
        expect(grid.getHeight()==10).toBe(true);
    })


    it('updateGridCell: cells must updated with new item', async () => {
        let grid = new Grid(10, 10);
        const sage = new SagePieceCreator().createPiece();
        const position: Position = {row: 2, column: 2};
        sage.updatePosition(position);
        grid.updateGridCell(sage);
        
        expect(grid.getGridCellByPosition(position)).toStrictEqual(sage);
    })
})