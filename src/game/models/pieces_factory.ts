import { ElementTypes } from "./elements/elements";
import { ElementFactoryMap } from "./elements/elements_factory";
import { Piece, Sage, Empty } from "./pieces";

/**
 * The PieceCreator class declares the factory method that is supposed to return an
 * object of a Piece class. The PieceCreator's subclasses usually provide the
 * implementation of this method.
 */
 abstract class PieceCreator {
    /**
     * Note that the Creator may also provide some default implementation of the
     * factory method.
     */
    public abstract factoryMethod(): Piece;
    /**
     * Also note that, despite its name, the PieceCreator's primary responsibility is
     * not creating pieces. Usually, it contains some core business logic that
     * relies on Piece objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of piece from it.
     */
    public createPiece(): Piece {
        // Call the factory method to create a Product object.
        const piece = this.factoryMethod();
        // Now, use the product.
        return piece;
    }

}

/**
 * PieceCreator override the factory method in order to change the
 * resulting piece's type.
 */
export class EmptyPieceCreator extends PieceCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Piece {
        return new Empty();
    }
}

/**
 * PieceCreator override the factory method in order to change the
 * resulting piece's type.
 */
export class SagePieceCreator extends PieceCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Piece {
        return new Sage();
    }
}

/**
 * PieceCreator override the factory method in order to change the
 * resulting piece's type.
 */
 export class ElementPieceCreator extends PieceCreator{

    private element_type: ElementTypes;
    
    constructor(element_type: ElementTypes){
        super();
        this.element_type = element_type;
    }

    public factoryMethod(): Piece {
        return new ElementFactoryMap[this.element_type]().createElement();
    }
}