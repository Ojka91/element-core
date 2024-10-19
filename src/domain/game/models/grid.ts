import { PieceModel, PieceTypes } from "./pieces/pieces";
import { Mapper } from '../utils/mapper';
import { EmptyModelMap } from './pieces/empty';
import { SageModelMap } from './pieces/sage';
import { ElementModelMap, ElementTypes } from "./elements/elements";
import { FireModelMap } from "./elements/fire";
import { WaterModelMap } from "./elements/water";
import { EarthModelMap } from "./elements/earth";
import { WindModelMap } from "./elements/wind";

export interface IGridModel {
    cells: Array<Array<PieceModel>>;
    width: number;
    height: number;
}

export class GridModel {

    cells: Array<Array<PieceModel>> = [];
    width: number = 0;
    height: number = 0;
}

export class GridModelMap extends Mapper{
    public toDomain(raw: any): IGridModel {
        const grid: IGridModel = new GridModel();
        grid.width = raw.width;
        grid.height = raw.height;
        for (const row of raw.cells){
            const row_cells: Array<PieceModel> = [];
            for (const piece of row){
                let mapper: SageModelMap | EmptyModelMap | ElementModelMap;
                switch(piece.type){
                case PieceTypes.Element:
                    mapper = elementTypeToMapper(piece.element_type);
                    break;
                case PieceTypes.Sage:
                    mapper = new SageModelMap();
                    break;
                case PieceTypes.Empty:
                default:
                    mapper = new EmptyModelMap();
                    break;
                }
                row_cells.push(mapper.toDomain(piece))
            }
            grid.cells.push(row_cells);
        }
        return grid;
    }
}

function elementTypeToMapper(element_type: ElementTypes): ElementModelMap {
    let mapper: ElementModelMap;
    switch(element_type){
    case ElementTypes.Fire:
        mapper = new FireModelMap();
        break;
    case ElementTypes.Water:
        mapper = new WaterModelMap();
        break;
    case ElementTypes.Earth:
        mapper = new EarthModelMap();
        break;
    case ElementTypes.Wind:
        mapper = new WindModelMap();
        break;
    }
    return mapper;
}