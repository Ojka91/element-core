import { Bcrypt } from "@/security/bcrypt";
import { IUser } from "@/database/models/user";
import UserRepository from "@/database/repositories/user-repository";


export class User {

    public async getUserData() {
        const encrypter = new Bcrypt();
        const user: IUser = {
            username: 'username',
            email: 'fakemail',
            password: encrypter.encrypt('pass'),
            createdAt: new Date()
        }

        console.log('Getting user data...')
        return UserRepository.create(user)
    }
}