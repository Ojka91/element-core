import { Mapper } from "@/game/utils/mapper";
import { ElementModel, IElementModel } from "./elements";

export interface IWaterModel extends IElementModel {

}

export class WaterModel extends ElementModel implements IWaterModel{

    constructor() {
        super();
    }
}

export class WaterModelMap extends Mapper {
    public toDomain(raw: any): WaterModel {
        const water: WaterModel = new WaterModel();
        water.position = raw.position;
        water.string_representation = raw.string_representation;
        water.type = raw.type;
        return water 
    }
}
