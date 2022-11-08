import express from 'express';
import { user } from '@/routes/user';

export const routes = express.Router();

routes.use(user);