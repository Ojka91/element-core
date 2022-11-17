import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/routes';
import * as dotenv from 'dotenv' 
import Database from './database';
import Swagger from './utils/swagger';
import Socket from './socket';
export const app: Express = express();
import Board from './game/models/board';
import Player, { GameType, PlayerNumber } from './game/models/player';
import { RedisSingleton } from './redis';
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

app.get('/game', async (_req: Request, res: Response) => {
  let board = new Board();
  let player_1 = new Player(PlayerNumber.player_1, GameType.TwoPlayersGame);
  let player_2 = new Player(PlayerNumber.player_2, GameType.TwoPlayersGame);
  // Letting sages in their starting position
  board.addPlayer(player_1);
  board.addPlayer(player_2);
  board.displayGrid();
  return res.send(board);
});

app.get('/add', async (_req: Request, res: Response) => {
  let redis = RedisSingleton.getInstance();
  let response = await redis.set('1234', {
    id: '1234',
    players: [
      {
        name: "oscar"
      },
      {
        name: "marc"
      }
    ]
  })
  return res.send(response);
});

app.get('/get', async (_req: Request, res: Response) => {
  let redis = RedisSingleton.getInstance();
  return res.send(await redis.get('1234'));
});

const redis = RedisSingleton.getInstance()
redis.connect()
export const socket = new Socket(server);
socket.init()
