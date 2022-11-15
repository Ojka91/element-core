import { Earth } from "./earth";
import { Element } from "./elements";
import { Fire } from "./fire";
import { Water } from "./water";
import { Wind } from "./wind";

/**
 * The ElementCreator class declares the factory method that is supposed to return an
 * object of a Element class. The ElementCreator's subclasses usually provide the
 * implementation of this method.
 */
 abstract class ElementCreator {
    /**
     * Note that the ElementCreator may also provide some default implementation of the
     * factory method.
     */
    public abstract factoryMethod(): Element;
    /**
     * Also note that, despite its name, the ElementCreator's primary responsibility is
     * not creating elements. Usually, it contains some core business logic that
     * relies on Element objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of element from it.
     */
    public createElement(): Element {
        // Call the factory method to create an Element object.
        const element = this.factoryMethod();
        // Now, use the product.
        return element;
    }

}

/**
 * EarthCreator override the factory method in order to change the
 * resulting piece's type.
 */
  class EarthCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Earth();
    }
}

/**
 * WaterCreator override the factory method in order to change the
 * resulting piece's type.
 */
  class WaterCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Water();
    }
}

/**
 * FireCreator override the factory method in order to change the
 * resulting piece's type.
 */
  class FireCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Fire();
    }
}

/**
 * WindCreator override the factory method in order to change the
 * resulting piece's type.
 */
  class WindCreator extends ElementCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): Element {
        return new Wind();
    }
}

export const ElementFactoryMap = {
    "Fire": FireCreator,
    "Water": WaterCreator,
    "Earth": EarthCreator,
    "Wind": WindCreator
};