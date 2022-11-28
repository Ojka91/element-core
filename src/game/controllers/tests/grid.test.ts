import { Earth } from "../elements/earth";
import { Fire } from "../elements/fire";
import { Water } from "../elements/water";
import { Wind } from "../elements/wind";
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

    it('clearCell: cells must cleared to empty', async () => {
        let grid = new Grid(10, 10);
        const sage = new SagePieceCreator().createPiece();
        const position: Position = {row: 2, column: 2};
        sage.updatePosition(position);
        grid.updateGridCell(sage);
        
        expect(grid.getGridCellByPosition(position)).toStrictEqual(sage);

        grid.clearCell(position);
        expect(grid.isPositionEmpty(position)).toBe(true);

    })

    it('isPositionValid: must return true is position between grid boundaries, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const position: Position = {row: 2, column: 2};
        const incorrect_position: Position = {row: 11, column: 11};
        
        expect(grid.isPositionValid(position)).toBe(true);

        expect(grid.isPositionValid(incorrect_position)).toBe(false);

    })

    it('isPositionEmpty: must return true if position is empty, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const sage = new SagePieceCreator().createPiece();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isPositionEmpty(position)).toBe(true);

        sage.updatePosition(position);
        grid.updateGridCell(sage);

        expect(grid.isPositionEmpty(position)).toBe(false);

    })

    it('isFireCell: must return true if position is fire, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Fire = new Fire();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isFireCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isFireCell(position)).toBe(true);

    })

    it('isEarthCell: must return true if position is earth, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Earth = new Earth();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isEarthCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isEarthCell(position)).toBe(true);

    })

    it('isWaterCell: must return true if position is Water, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Water = new Water();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isWaterCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isWaterCell(position)).toBe(true);

    })

    it('isWindCell: must return true if position is Wind, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Wind = new Wind();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isWindCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isWindCell(position)).toBe(true);

    })

    it('isWhirlwindCell: must return true if position is Whirlwind, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Wind = new Wind();
        piece.increaseStackedWinds();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isWhirlwindCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isWhirlwindCell(position)).toBe(true);

    })

    it('isMountainCell: must return true if position is Mountain, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Earth = new Earth();
        piece.promoteToMountain();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isMountainCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isMountainCell(position)).toBe(true);

    })

    it('isRangeCell: must return true if position is Range, false othwerwise', async () => {
        let grid = new Grid(10, 10);

        const piece: Earth = new Earth();
        piece.promoteToRange();
        const position: Position = {row: 0, column: 0};
        
        // Upon creation grid is empty
        expect(grid.isRangeCell(position)).toBe(false);

        piece.updatePosition(position);
        grid.updateGridCell(piece);

        expect(grid.isRangeCell(position)).toBe(true);

    })
})