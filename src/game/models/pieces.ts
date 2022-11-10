export abstract class Piece {
    row: number = 0;
    column: number = 0;

    // debugging purposes
    string_representation: string = "";

    updatePosition(new_row: number, new_column: number){
        this.row = new_row;
        this.column = new_column;

    }
}

export class Empty extends Piece {
    /** Empty piece class */
    constructor(){
        super();
        this.string_representation = " "
    }
}

export class Sage extends Piece {
    /** Sage piece class */
    constructor(){
        super();
        this.string_representation = "S"
    }
}
