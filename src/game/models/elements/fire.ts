import { Mapper } from "@/game/utils/mapper";
import { ElementModel, ElementTypes, IElementModel } from "./elements";

export interface IFireModel extends IElementModel {
}

export class FireModel extends ElementModel implements IFireModel{

    constructor() {
        super();
        this.element_type = ElementTypes.Fire
    }
}

export class FireModelMap extends Mapper {
    public toDomain(raw: any): FireModel {
        const fire: FireModel = new FireModel();
        fire.position = raw.position;
        fire.string_representation = raw.string_representation;
        fire.type = raw.type;
        return fire;
    }
}
