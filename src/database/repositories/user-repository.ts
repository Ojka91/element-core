import User, {IUser} from '@/database/models/user'


class UserRepository {

    /**
     * Store new user on DB
     * @param newUser: IUser 
     * @returns 
     */
    public static async create(newUser: IUser): Promise<any>{
        try {
            return await new User(newUser).save()
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserRepository;