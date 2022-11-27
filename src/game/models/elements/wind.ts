import { Mapper } from "@/game/utils/mapper";
import { ElementModel, IElementModel } from "./elements";

export interface IWindModel extends IElementModel {
    stacked_winds: number;
}

export class WindModel extends ElementModel implements IWindModel {
    stacked_winds: number = 1;

    constructor() {
        super();
    }
}

export class WindModelMap extends Mapper {
    public toDomain(raw: any): WindModel {
        const wind: WindModel = new WindModel();
        wind.position = raw.position;
        wind.string_representation = raw.string_representation;
        wind.type = raw.type;
        wind.stacked_winds = raw.stacked_winds;

        return wind 
    }
}
