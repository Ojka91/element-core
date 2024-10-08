import { GridModel, GridModelMap} from "./grid";
import { ElementPoolManagerModel, ElementPoolManagerModelMap } from "./element_pool";
import { SageModel, SageModelMap } from "./pieces/sage";

import { Mapper } from "../utils/mapper";

const COLUMN_PIECES_WIDTH: number = 11;
const ROW_PIECES_HEIGHT: number = 11;

export interface IBoardModel {
    grid: GridModel;
    sage_list: Array<SageModel>;
    elementPool: ElementPoolManagerModel;
}

export class BoardModel {

    grid: GridModel = new GridModel();
    sage_list: Array<SageModel> = [];
    elementPool: ElementPoolManagerModel = new ElementPoolManagerModel();
}

export class BoardModelMap extends Mapper {
    public toDomain(raw: any): IBoardModel {
        const board: BoardModel = new BoardModel();
        board.grid = new GridModelMap().toDomain(raw.grid);
        for (let sage of raw.sage_list){
            const sage_model: SageModel = new SageModelMap().toDomain(sage);
            board.sage_list.push(sage_model);
        }
        board.elementPool = new ElementPoolManagerModelMap().toDomain(raw.elementPool);
        return board;
    }
}