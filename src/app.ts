import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/infra/routes';
import * as dotenv from 'dotenv'
import Swagger from '@/utils/swagger';
import SocketController from '@/infra/socket/socketController';
export const app: Express = express();
import { RedisSingleton } from '@/infra/redis';
import { RoomModel } from '@/domain/game/models/room';
import RoomController from '@/domain/game/controllers/room_controller';
import { UserModel } from '@/domain/game/models/user';
import GameCache from '@/infra/service/gameCache';
import DomainEventEmitterSingleton from './domain/service/DomainEventEmitter';
import TimerService from './domain/service/timer/TimerService';
//import { User } from '@/controllers/user';
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

const server = app.listen(process.env.PORT || 3000, () => {
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

    // await room_controller.gameStart();

    res.send(room);
});

/** Debugging purposes: Display the entire room */
app.get('/display_room', async (_req: Request, res: Response) => {

    const room: RoomModel = new RoomModel(0)
    const room_controller: RoomController = new RoomController(room, GameCache);
    await room_controller.loadRoomById(room_id);
    console.log(room)
    res.send(room);
});

app.get('/add', async (_req: Request, res: Response) => {
    const redis = RedisSingleton.getInstance();
    const response = await redis.set('1234', {
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
})    ;

if (process.env.ENV != 'development') RedisSingleton.getInstance().connect();
const timerService = new TimerService();
const eventEmitter = DomainEventEmitterSingleton.getInstance();

export const socket = new SocketController(server, timerService, eventEmitter);
socket.init()
