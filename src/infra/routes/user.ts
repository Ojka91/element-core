import { User } from '@/infra/controllers/user';
import express, { Request, Response, Router } from 'express';

export const user: Router = express.Router();

/**
 * @openapi
 * /user:
 *   get:
 *     description: Testing swagger. It will create a new user on BD every time you GET this path
 *     responses:
 *       200:
 *         description: Returns user created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */
user.get('/user', async (req: Request, res: Response) => {
    const userController = new User();
    res.send(await userController.getUserData());
})


