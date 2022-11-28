import { ElementTypes } from "@/game/models/elements/elements";
import { ElementPoolManagerModel } from "@/game/models/element_pool";
import ElementPoolManager from "../element_pool_controller";


describe('ElementPoolManager', () => {
    const NUM_PIECES_PER_ELEMENT: number = 30;
    it('addElement: adding an element updates the pool ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);
        pool_manager.fire.amount = 0;
        pool_controller.addElement(ElementTypes.Fire);
        expect(pool_manager.fire.amount == 1).toBe(true);
    });

    it('addElement: adding an element to the pool when full ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);
        // By default it's initialized to the maximum value
        expect(() => {
            pool_controller.addElement(ElementTypes.Fire);
        }).toThrow("Trying to add more items in pool than the maximum allowed");
        
    });

    it('removeElement: removing an element updates the pool ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);
        pool_manager.fire.amount = 30;
        pool_controller.removeElement(ElementTypes.Fire);
        expect(pool_manager.fire.amount == 29).toBe(true);
    });

    it('removeElement: removing an element to the pool when empty ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);
        pool_manager.fire.amount = 0;
        expect(() => {
            pool_controller.removeElement(ElementTypes.Fire);
        }).toThrow("Trying to remove items in an empty pool");
        
    });

    it('fillPool: every element pool must be filled ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);
        pool_controller.fillPool(); 
        let result = pool_manager.fire.amount == NUM_PIECES_PER_ELEMENT;
        result = result == (pool_manager.water.amount == NUM_PIECES_PER_ELEMENT);
        result = result == (pool_manager.earth.amount == NUM_PIECES_PER_ELEMENT);
        result = result == (pool_manager.wind.amount == NUM_PIECES_PER_ELEMENT);

        expect(result).toBe(true);
        
    });

    it('emptyPool: every element pool must be emptied ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);
        pool_controller.emptyPool(); 
        let result = pool_manager.fire.amount == 0;
        result = result == (pool_manager.water.amount == 0);
        result = result == (pool_manager.earth.amount == 0);
        result = result == (pool_manager.wind.amount == 0);

        expect(result).toBe(true);
        
    });

    it('checkElementAvailable: checks whether the element is available ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);

        const element: ElementTypes = ElementTypes.Earth;
        
        pool_controller.fillPool();
        expect(pool_controller.checkElementAvailable(element)).toBe(true);
        
        pool_controller.emptyPool(); 
        expect(pool_controller.checkElementAvailable(element)).toBe(false);
        
    });
    
    it('checkElementListAvailability: checks whether the elements are available ', async () => {
        let pool_manager = new ElementPoolManagerModel();
        const pool_controller: ElementPoolManager = new ElementPoolManager(pool_manager);

        const elements: Array<ElementTypes> = [ElementTypes.Earth, ElementTypes.Fire, ElementTypes.Water, ElementTypes.Wind];
        
        pool_controller.fillPool();
        expect(pool_controller.checkElementListAvailability(elements)).toBe(true);
        
        pool_controller.emptyPool(); 
        expect(pool_controller.checkElementListAvailability(elements)).toBe(false);
        
    });

    
})
  