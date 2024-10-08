import express from 'express';
import { user } from '@/infra/routes/user';
const pino = require('pino-http')()


export const routes = express.Router();
routes.use(pino)

routes.use(user);