import { IUserModel } from '../models/user'

export class UserController {
    private model: IUserModel

    constructor(model: IUserModel) {
        this.model = model;
    }

    getUuid(): string {
        return this.model.uuid;
    }

    getName(): string {
        return this.model.name;
    }
}