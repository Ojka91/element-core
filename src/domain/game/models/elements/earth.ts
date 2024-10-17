import { ElementModel, ElementModelMap, ElementTypes, IElementModel } from "./elements";


export interface IEarthModel extends IElementModel {
    is_mountain: boolean
    is_range: boolean
}

export class EarthModel extends ElementModel implements IEarthModel {
    is_mountain: boolean = false;
    is_range: boolean = false;

    constructor(){
        super();
        this.element_type = ElementTypes.Earth;
    }
}

export class EarthModelMap extends ElementModelMap {
    public toDomain(raw: any): EarthModel {
        const earth: EarthModel = new EarthModel();
        earth.position = raw.position;
        earth.is_mountain = raw.is_mountain;
        earth.is_range = raw.is_range;
        earth.string_representation = raw.string_representation;
        earth.type = raw.type;
        return earth;
    }
}