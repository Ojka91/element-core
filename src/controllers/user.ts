import { IUser } from "../database/models/user";
import UserRepository from "../database/repositories/user-repository";


export class User {

    public async getUserData() {
        const user: IUser = {
            email: 'fakemail',
            password: 'pass',
            createdAt: new Date(),
            recoverPasswordToken: 'token',
        }

        console.log('Getting user data...')
        return UserRepository.create(user)
    }
}