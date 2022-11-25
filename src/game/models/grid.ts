import { PieceModel, PieceTypes } from "./pieces/pieces";
import { Mapper } from '../utils/mapper';
import { EmptyModelMap } from './pieces/empty';
import { SageModelMap } from './pieces/sage';

export interface IGridModel {
    cells: Array<Array<PieceModel>>;
    width: number;
    height: number;
}

export class GridModel {

    cells: PieceModel[][] = [];
    width: number = 0;
    height: number = 0;
}

export class GridModelMap extends Mapper{
    public toDomain(raw: any): IGridModel {
        const grid: IGridModel = new GridModel();
        grid.width = raw.width;
        grid.height = raw.height;
        for (let row of raw.cells){
            for (let piece of row){
                let mapper: SageModelMap | SageModelMap | ElementModelMap;
                switch(piece.type){
                    case PieceTypes.Element:
                        mapper = ElementModelMap;
                        break;
                    case PieceTypes.Sage:
                        mapper = SageModelMap;
                        break;
                    case PieceTypes.Empty:
                    default:
                        mapper = EmptyModelMap;
                        break;
                }
                grid.cells.push(new mapper().toDomain(piece))
            }
        }
        return grid;
    }
}