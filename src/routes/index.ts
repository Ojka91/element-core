import express from 'express';
import { user } from './user';

export const routes = express.Router();

routes.use(user);