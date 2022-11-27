import { Mapper } from "../utils/mapper";

export const NUM_PIECES_PER_ELEMENT: number = 30;

export interface IElementPoolModel {
    amount: number;
}

export class ElementPoolModel {
    amount: number = NUM_PIECES_PER_ELEMENT;
}

class ElementPoolModelMap extends Mapper{
    public toDomain(raw: any) : ElementPoolModel {
        const pool: ElementPoolModel = new ElementPoolModel();
        pool.amount = raw.amount;
        return pool
    }
}

export interface IElementPoolManagerModel {
    fire: ElementPoolModel;
    water: ElementPoolModel;
    wind: ElementPoolModel;
    earth: ElementPoolModel;
}

export class ElementPoolManagerModel {
    fire: ElementPoolModel = new ElementPoolModel();
    water: ElementPoolModel = new ElementPoolModel();
    wind: ElementPoolModel = new ElementPoolModel();
    earth: ElementPoolModel = new ElementPoolModel();
}

export class ElementPoolManagerModelMap extends Mapper{
    public toDomain(raw: any) : ElementPoolManagerModel {
        const manager: ElementPoolManagerModel = new ElementPoolManagerModel();
        manager.fire = new ElementPoolModelMap().toDomain(raw.fire);
        manager.water = new ElementPoolModelMap().toDomain(raw.water);
        manager.earth = new ElementPoolModelMap().toDomain(raw.earth);
        manager.wind = new ElementPoolModelMap().toDomain(raw.wind);
        return manager
    }
}
