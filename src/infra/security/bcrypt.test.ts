import { Bcrypt } from "./bcrypt";
import bcrypt from 'bcrypt';

jest.mock('bcrypt')
describe('Bcrypt', () => {
    it('Should call hashSync method', async () => {
        jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce ('encryptedString')

        const encrypter = new Bcrypt();
        const encryptedPassword = await encrypter.encrypt('password');
        expect(bcrypt.hashSync).toBeCalledTimes(1);
        expect(encryptedPassword).toBe('encryptedString')
   
    })

    it('Should call compareSync method', async () => {
        jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce (true)

        const encrypter = new Bcrypt();
        const isValid = await encrypter.isValid('password', 'hashedPassword');
        expect(bcrypt.compareSync).toBeCalledTimes(1);
        expect(isValid).toBe(true)
    })  

})
  