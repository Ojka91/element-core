import { Position } from "./grid";

export abstract class Piece {
    position: Position = {
        row: 0,
        column: 0
    };

    // debugging purposes
    string_representation: string = "";

    updatePosition(new_position: Position){
        this.position = new_position;

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
