import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/routes';
import * as dotenv from 'dotenv' 
import Database from './database';
import Swagger from './utils/swagger';
import Socket from './socket';
export const app: Express = express();
import { RedisSingleton } from './redis';
import Room from './game/models/room';
import { User } from './game/user';
import { GameController } from './game/game_controller';
//import { User } from './controllers/user';
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

/* Game debugging endpoints */
let room_id: string;
app.get('/game', async (_req: Request, res: Response) => {
  let room = new Room();
  const game: GameController = new GameController();
  room_id = room.getUuid()

  const user_1: User = new User("Arkk92");
  const user_2: User = new User("Ojka");

  room.addUser(user_1);
  room.addUser(user_2);

  await game.gameStart(room);

  return res.send(room);
});

/** Debugging purposes: Display the game board */
app.get('/display_board', async (_req: Request, res: Response) => {
  
  const game: GameController = new GameController();
  const room: Room = await game.loadRoom(room_id);

  return res.send(room);
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

if (process.env.ENV != 'development') RedisSingleton.getInstance().connect()

export const socket = new Socket(server);
socket.init()
