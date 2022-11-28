import { PositionUtils, Position } from "../../utils/position_utils";




describe('PositionUtils', () => {
    it('isSamePosition: should return true if positions are equal ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 1, column: 2};

        expect(PositionUtils.isSamePosition(pos_1, pos_2)).toBe(true);
    });

    it('isSamePosition: should return false if positions are different ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 1, column: 3};

        expect(PositionUtils.isSamePosition(pos_1, pos_2)).toBe(false);
    });

    it('isStrictPosition: should return true if there is an strict distance of 1, even in diagonal ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 1, column: 3};
        const pos_3: Position = {row: 2, column: 3};

        expect(PositionUtils.isStrictPosition(pos_1, pos_2)).toBe(true);
        expect(PositionUtils.isStrictPosition(pos_1, pos_3)).toBe(true);
    });

    it('isStrictPosition: should return false if distance is not 1 ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 1, column: 4};

        expect(PositionUtils.isStrictPosition(pos_1, pos_2)).toBe(false);
    });

    it('isOrthogonalPosition: should return true if positions are orthogonal ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 1, column: 5};

        expect(PositionUtils.isOrthogonalPosition(pos_1, pos_2)).toBe(true);
    });

    it('isOrthogonalPosition: should return false if positions are diagonal ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 3, column: 4};

        expect(PositionUtils.isOrthogonalPosition(pos_1, pos_2)).toBe(false);
    });

    it('isStrictOrthogonalPosition: should return true if positions are orthogonal and strict ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 2, column: 2};

        expect(PositionUtils.isStrictOrthogonalPosition(pos_1, pos_2)).toBe(true);
    });

    it('isStrictOrthogonalPosition: should return false if positions are not orthogonal nor strict ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 2, column: 3};
        const pos_3: Position = {row: 1, column: 6};

        expect(PositionUtils.isStrictOrthogonalPosition(pos_1, pos_2)).toBe(false);
        expect(PositionUtils.isStrictOrthogonalPosition(pos_1, pos_3)).toBe(false);
    });

    it('isDiagonalPosition: should return true if positions are diagonal ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 2, column: 3};

        expect(PositionUtils.isDiagonalPosition(pos_1, pos_2)).toBe(true);
    });

    it('isDiagonalPosition: should return false if positions are not diagonal ', async () => {
        const pos_1: Position = {row: 1, column: 2};
        const pos_2: Position = {row: 1, column: 4};

        expect(PositionUtils.isDiagonalPosition(pos_1, pos_2)).toBe(false);
    });

    


  
})
  