import bcrypt from 'bcrypt';
 
export class Bcrypt {

    private saltRounds = 10;

    public encrypt(password: string): string {
        const salt = bcrypt.genSaltSync(this.saltRounds);
        return bcrypt.hashSync(password, salt);
    }

    public isValid(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash); 
    }
}