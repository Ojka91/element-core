import { logger } from "@/utils/logger";


export class User {

    public async getUserData() {

        logger.warn({fake: 'obj'}, 'this is warn')
        logger.info({fake: 'obj'}, 'this is info')
        logger.error({fake: 'obj'}, 'this is error')
        //return UserRepository.create(user)
        return 'User created'
    }
}