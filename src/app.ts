import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from '@/routes';
import mongoose from 'mongoose'
import * as dotenv from 'dotenv' 
import Board from './game/models/board';
import Player, { GameType, PlayerNumber } from './game/models/player';
import { Redis } from './redis';
const app: Express = express();
dotenv.config({ path: `.env${process.env.NODE_ENV}` });
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Element API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(cors({ exposedHeaders: ['*', 'token'] }));
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes)

mongoose.connect(process.env.MONGO_URL || '', { dbName: process.env.DATABASE, useNewUrlParser: true, useUnifiedTopology: true }, () => {
  if(mongoose.connection.readyState === 1) {
    console.error('Database connected successfuly');
  } else {
    console.log('Could not connect to database');
  }
});

app.get('/health', async (_req: Request, res: Response) => {
  return res.send({status: 'ok'});
});

app.listen(process.env.PORT || 3000, () => {
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

const redis = new Redis()
redis.connect()