import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/routes';
import * as dotenv from 'dotenv' 

import Database from './database';
import Swagger from './utils/swagger';
//import Socket from './socket';
export const app: Express = express();
dotenv.config({ path: `.env${process.env.NODE_ENV}` });
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(cors({ exposedHeaders: ['*', 'token'] }));
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes)
Swagger.setup(app);
Database.connect();
//Socket.init(app);
io.on('connection', (_socket: any) => {
  console.log('a user connected');
});
app.get('/health', async (_req: Request, res: Response) => {
  return res.send({status: 'ok'});
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000')
});