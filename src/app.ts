import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/routes';
import * as dotenv from 'dotenv' 
import Database from './database';
import Swagger from './utils/swagger';
import Socket from './socket';
export const app: Express = express();
dotenv.config({ path: `.env${process.env.NODE_ENV}` });

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes)
Swagger.setup(app);
Database.connect();

app.get('/health', async (_req: Request, res: Response) => {
  return res.send({status: 'ok'});
});

var server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000')
});

export const socket = new Socket(server);
socket.init()
