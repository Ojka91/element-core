import { ElementTypes } from "../elements/elements";
import ElementPoolManager, { NUM_PIECES_PER_ELEMENT } from "../element_pool_manager";

describe('ElementPoolManager', () => {
    it('addElement: adding an element updates the pool ', async () => {
        let pool_manager = new ElementPoolManager();
        pool_manager.fire.amount = 0;
        pool_manager.addElement(ElementTypes.Fire);
        expect(pool_manager.fire.amount == 1).toBe(true);
    });

    it('addElement: adding an element to the pool when full ', async () => {
        let pool_manager = new ElementPoolManager();
        // By default it's initialized to the maximum value
        expect(() => {
            pool_manager.addElement(ElementTypes.Fire);
        }).toThrow("Trying to add more items in pool than the maximum allowed");
        
    });

    it('removeElement: removing an element updates the pool ', async () => {
        let pool_manager = new ElementPoolManager();
        pool_manager.fire.amount = 30;
        pool_manager.removeElement(ElementTypes.Fire);
        expect(pool_manager.fire.amount == 29).toBe(true);
    });

    it('removeElement: removing an element to the pool when empty ', async () => {
        let pool_manager = new ElementPoolManager();
        pool_manager.fire.amount = 0;
        expect(() => {
            pool_manager.removeElement(ElementTypes.Fire);
        }).toThrow("Trying to remove items in an empty pool");
        
    });

    it('fillPool: every element pool must be filled ', async () => {
        let pool_manager = new ElementPoolManager();
        pool_manager.fillPool(); 
        let result = pool_manager.fire.amount == NUM_PIECES_PER_ELEMENT;
        result = result == (pool_manager.water.amount == NUM_PIECES_PER_ELEMENT);
        result = result == (pool_manager.earth.amount == NUM_PIECES_PER_ELEMENT);
        result = result == (pool_manager.wind.amount == NUM_PIECES_PER_ELEMENT);

        expect(result).toBe(true);
        
    });

    it('fillPool: every element pool must be filled ', async () => {
        let pool_manager = new ElementPoolManager();
        pool_manager.emptyPool(); 
        let result = pool_manager.fire.amount == 0;
        result = result == (pool_manager.water.amount == 0);
        result = result == (pool_manager.earth.amount == 0);
        result = result == (pool_manager.wind.amount == 0);

        expect(result).toBe(true);
        
    });

    
})
  