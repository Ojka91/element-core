import express from 'express';
import { user } from '@/infra/routes/user';
import pinoHttp from 'pino-http';

const pino = pinoHttp()

export const routes = express.Router();
routes.use(pino)

routes.use(user);