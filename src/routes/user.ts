import { User } from '../controllers/user';
import express, { Request, Response, Router } from 'express';

export const user: Router = express.Router();

user.get('/user', async (req: Request, res: Response) => {
    const userController = new User();
    return res.send(userController.getUserData());
})

