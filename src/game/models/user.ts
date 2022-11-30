import { Mapper } from "../utils/mapper";
import {v4 as uuidv4} from 'uuid';

export interface IUserModel {
    name: string;
    uuid: string;
    socket_id: string;
}

export class UserModel {
    name: string = "";
    uuid: string = "";
    socket_id: string = "";

    constructor(){
        this.uuid = uuidv4();
    }
}

export class UserModelMap extends Mapper {
    public toDomain(raw: any): UserModel {
        const user: UserModel = new UserModel();
        user.name = raw.name;
        user.uuid = raw.uuid;
        return user;
    }
}