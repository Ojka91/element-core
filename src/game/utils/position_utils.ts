
export type AxisIncrement = {
    x: number,
    y: number
}

export type Position = {
    row: number,
    column: number
};

export class PositionUtils {

    static orthogonal_increment_map: Map<string, AxisIncrement> = new Map([
        ["Up", {
            x: 0,
            y: 1
        }],
        ["Left", {
            x: -1,
            y: 0
        }],
        ["Down", {
            x: 0,
            y: -1
        }],
        ["Right", {
            x: 1,
            y: 0
        }]
    ])
    static diagonal_increment_map: Map<string, AxisIncrement> = new Map([
        ["Up-Left", {
            x: -1,
            y: 1
        }],
        ["Left-Down", {
            x: -1,
            y: -1
        }],
        ["Down-Right", {
            x: 1,
            y: -1
        }],
        ["Up-Right", {
            x: 1,
            y: 1
        }]
    ])

    static all_direction_increment_map: Map<string, AxisIncrement> = new Map([
        ...this.orthogonal_increment_map.entries(),
        ...this.diagonal_increment_map.entries()
    ])


    /** Check whether positions are different or not
     * return: true if are the same, false otherwise
     */
    public static isSamePosition(current_position: Position, new_position: Position): boolean {
        return (current_position.row == new_position.row) && (current_position.column == new_position.column);
    }

    /** Check whether the move is strict or not. Strict means moves of only a single cell
     * return: true if is strict, false otherwise
     */
    public static isStrictPosition(current_position: Position, new_position: Position): boolean {
        const distance_x: number = Math.abs(current_position.column - new_position.column);
        const distance_y: number = Math.abs(current_position.row - new_position.row);

        if ((distance_x > 1) || (distance_y > 1)) {
            return false;
        }
        return true;
    }

    /** Check whether the move is orthogonal
     * return: true if orthogonal, false otherwise
     */
    public static isOrthogonalPosition(current_position: Position, new_position: Position): boolean {

        if ((current_position.row != new_position.row) && (current_position.column == new_position.column)) {
            /** Horizontally Orthogonal */
            return true;
        }

        if ((current_position.column != new_position.column) && (current_position.row == new_position.row)) {
            /** Vertically Orthogonal */
            return true;
        }
        return false;
    }

    /** Check whether is strict orthogonal
     * return: true if strict orthogonal, false otherwise
     */
    public static isStrictOrthogonalPosition(current_position: Position, new_position: Position): boolean {
        return this.isOrthogonalPosition(current_position, new_position) && this.isStrictPosition(current_position, new_position);
    }

    /** Check whether the move is diagonal
     * return: true if diagonal, false otherwise
     */
    public static isDiagonalPosition(current_position: Position, new_position: Position): boolean {
        if ((Math.abs(current_position.row - new_position.row) == 1) && (Math.abs(current_position.column - new_position.column) == 1)) {
            /** Diagonal move */
            return true;
        }
        return false;
    }
}