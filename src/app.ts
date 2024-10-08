import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/routes';
import * as dotenv from 'dotenv'
import Database from './database';
import Swagger from './utils/swagger';
import SocketController from './socket/socket';
export const app: Express = express();
import { RedisSingleton } from './redis';
import { GameController } from './game/controllers/game_controller';
import { RoomModel } from './game/models/room';
import RoomController from './game/controllers/room_controller';
import { UserModel } from './game/models/user';
import user from './database/models/user';
import GameCache from './service/game_cache';
//import { User } from './controllers/user';
dotenv.config({ path: `.env${process.env.NODE_ENV}` });

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes)
Swagger.setup(app);
//Database.connect();

app.get('/health', async (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

var server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000')
});

/* Game debugging endpoints */
let room_id: string;
app.get('/game', async (_req: Request, res: Response) => {
  const room: RoomModel = new RoomModel(2);
  const room_controller: RoomController = new RoomController(room, GameCache);
  
  room_id = room_controller.getUuid()

  const user_1: UserModel = new UserModel();
  const user_2: UserModel = new UserModel();
  user_1.name = "Arkk92";
  user_2.name = "Ojka";

  room_controller.addUser(user_1);
  room_controller.addUser(user_2);

  await room_controller.gameStart();

  res.send(room);
});

/** Debugging purposes: Display the entire room */
app.get('/display_room', async (_req: Request, res: Response) => {

  let room: RoomModel = new RoomModel(0)
  const room_controller: RoomController = new RoomController(room, GameCache);
  await room_controller.loadRoomById(room_id);
  console.log(room)
  res.send(room);
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
  res.send(response);
});

app.get('/get', async (_req: Request, res: Response) => {
  // const gameController = new GameController();

  // // let roomId: string = await gameController.createRoom();
  // // let rooma = await gameController.loadRoom(roomId);
  // // let room = Object.assign(new Room(), rooma)
  // // gameController.addUser(room, 'oscar')
  // // await gameController.gameStart(room);
  // let room: Room = new Room();
  // room.addUser(new User("oscar"))
  // room.addUser(new User("pep"))
  // room.gameStart()

  // console.log( room)

  res.send('room_asdasda');
});

if (process.env.ENV != 'development') RedisSingleton.getInstance().connect()

export const socket = new SocketController(server);
socket.init()
