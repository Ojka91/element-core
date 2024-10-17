import { ElementTypes } from '@/domain/game/models/elements/elements';
import { ElementPoolManagerModel, ElementPoolModel, IElementPoolModel } from '../models/element_pool';

export const NUM_PIECES_PER_ELEMENT: number = 30;

class ElementPoolController {
    private model: ElementPoolModel;

    constructor(model: IElementPoolModel){
        this.model = model;
    }

    public increase(): void {
        if (this.model.amount + 1 <= NUM_PIECES_PER_ELEMENT) { 
            this.model.amount++;
        } else {
            throw new Error("Trying to add more items in pool than the maximum allowed");
        }
    }

    public decrease(): void {
        if (this.model.amount - 1 >= 0) { 
            this.model.amount--;
        } else {
            throw new Error("Trying to remove items in an empty pool");
        }
    }

    public fill(): void {
        this.model.amount = NUM_PIECES_PER_ELEMENT;
    }

    public empty(): void {
        this.model.amount = 0;
    }
}

class ElementPoolManager {

    private model: ElementPoolManagerModel;

    private controller = ElementPoolController;

    private mapper: Map<ElementTypes, ElementPoolModel> = new Map();
    
    constructor(model: ElementPoolManagerModel){
        this.model = model;
        this.mapper = this.mapper.set(ElementTypes.Fire, this.model.fire);
        this.mapper = this.mapper.set(ElementTypes.Water, this.model.water);
        this.mapper = this.mapper.set(ElementTypes.Earth, this.model.earth);
        this.mapper = this.mapper.set(ElementTypes.Wind, this.model.wind);

    }

    public addElement(element: ElementTypes): void {
        const pool_element: ElementPoolModel = this.mapper.get(element)!;
        new this.controller(pool_element).increase();
    }

    public removeElement(element: ElementTypes): void {
        const pool_element: ElementPoolModel = this.mapper.get(element)!;
        new this.controller(pool_element).decrease();
    }

    public fillPool(): void {
        for (const pool_item of this.mapper.values()){
            new this.controller(pool_item).fill();
        }
    }

    public emptyPool(): void {
        for (const pool_item of this.mapper.values()){
            new this.controller(pool_item).empty();
        }
    }

    public checkElementAvailable(element: ElementTypes): boolean {
        const amount: number = this.mapper.get(element)!.amount
        if((amount - 1) < 0){
            return false;
        }
        return true;
    }

    public checkElementListAvailability(elements: Array<ElementTypes>): boolean {
        for(const element_type in ElementTypes){
            const amount_requested: number = elements.filter(element => element === element_type ).length
            const amount: number = this.mapper.get(element_type as ElementTypes)!.amount

            if((amount - amount_requested) < 0){
                return false;
            }
        }
        return true;
    }

    public getRemainingElementAmount(): number {
        return this.model.earth.amount + this.model.wind.amount + this.model.fire.amount + this.model.water.amount
    }
    
}

export default ElementPoolManager;