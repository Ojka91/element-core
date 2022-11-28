import { EarthModel } from "./earth";
import { ElementModel } from "./elements";
import { FireModel } from "./fire";
import { WaterModel } from "./water";
import { WindModel } from "./wind";

/**
 * The ElementModelCreator class declares the factory method that is supposed to return an
 * object of a ElementModel class. The ElementModelCreator's subclasses usually provide the
 * implementation of this method.
 */
abstract class ElementModelCreator {
    /**
     * Note that the ElementModelCreator may also provide some default implementation of the
     * factory method.
     */
    public abstract factoryMethod(): ElementModel;
    /**
     * Also note that, despite its name, the ElementModelCreator's primary responsibility is
     * not creating elements. Usually, it contains some core business logic that
     * relies on ElementModel objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of element from it.
     */
    public createElementModel(): ElementModel {
        // Call the factory method to create an ElementModel object.
        const element = this.factoryMethod();
        // Now, use the product.
        return element;
    }

}

/**
 * EarthModelCreator override the factory method in order to change the
 * resulting piece's type.
 */
class EarthModelCreator extends ElementModelCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): ElementModel {
        return new EarthModel();
    }
}

/**
 * WaterModelCreator override the factory method in order to change the
 * resulting piece's type.
 */
class WaterModelCreator extends ElementModelCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): ElementModel {
        return new WaterModel();
    }
}

/**
 * FireModelCreator override the factory method in order to change the
 * resulting piece's type.
 */
class FireModelCreator extends ElementModelCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): ElementModel {
        return new FireModel();
    }
}

/**
 * WindModelCreator override the factory method in order to change the
 * resulting piece's type.
 */
class WindModelCreator extends ElementModelCreator {
    /**
     * Note that the signature of the method still uses the abstract pieces
     * type, even though the empty piece is actually returned from the
     * method. This way the PieceCreator can stay independent of piece type
     * classes.
     */
    public factoryMethod(): ElementModel {
        return new WindModel();
    }
}

export const ElementModelFactoryMap = {
    "Fire": FireModelCreator,
    "Water": WaterModelCreator,
    "Earth": EarthModelCreator,
    "Wind": WindModelCreator
};