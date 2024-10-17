import { Bcrypt } from "@/infra/security/bcrypt";
import { IUser } from "@/infra/database/models/user";
import UserRepository from "@/infra/database/repositories/user-repository";
import { logger } from "@/utils/logger";


export class User {

    public async getUserData() {
        const encrypter = new Bcrypt();
        const user: IUser = {
            username: 'username',
            email: 'fakemail',
            password: encrypter.encrypt('pass'),
            createdAt: new Date()
        }

        logger.warn({fake: 'obj'}, 'this is warn')
        logger.info({fake: 'obj'}, 'this is info')
        logger.error({fake: 'obj'}, 'this is error')
        //return UserRepository.create(user)
        return 'User created'
    }
}