import { ElementTypes } from "./elements/elements";

export const NUM_PIECES_PER_ELEMENT: number = 30;

class ElementPool {
    amount: number = NUM_PIECES_PER_ELEMENT;

    public increase(): void {
        if (this.amount + 1 <= NUM_PIECES_PER_ELEMENT) { 
            this.amount++;
        } else {
            throw new Error("Trying to add more items in pool than the maximum allowed");
        }
    }

    public decrease(): void {
        if (this.amount - 1 >= 0) { 
            this.amount--;
        } else {
            throw new Error("Trying to remove items in an empty pool");
        }
    }

    public fill(): void {
        this.amount = NUM_PIECES_PER_ELEMENT;
    }

    public empty(): void {
        this.amount = 0;
    }
}

class ElementPoolManager {

    fire: ElementPool = new ElementPool();
    water: ElementPool = new ElementPool();
    earth: ElementPool = new ElementPool();
    wind: ElementPool = new ElementPool();

    private mapper = new Map();
    
    constructor(){

        this.mapper = this.mapper.set(ElementTypes.Fire, this.fire);
        this.mapper = this.mapper.set(ElementTypes.Water, this.water);
        this.mapper = this.mapper.set(ElementTypes.Earth, this.earth);
        this.mapper = this.mapper.set(ElementTypes.Wind, this.wind);

    }

    public addElement(element: ElementTypes): void {
        const pool_element: ElementPool = this.mapper.get(element);
        pool_element.increase();
    }

    public removeElement(element: ElementTypes): void {
        const pool_element: ElementPool = this.mapper.get(element);
        pool_element.decrease();
    }

    public fillPool(): void {
        for (let pool_item of this.mapper.values()){
            pool_item.fill();
        }
    }

    public emptyPool(): void {
        for (let pool_item of this.mapper.values()){
            pool_item.empty();
        }
    }

    public checkElementsAvailability(elements: Array<ElementTypes>): boolean {
        for(let element_type in ElementTypes){
            const amount_requested: number = elements.filter(element => element === element_type ).length
            const amount: number = this.mapper.get(element_type).amount

            if((amount - amount_requested) < 0){
                return false;
            }
        }
        return true;
    }
    
}

export default ElementPoolManager;