import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from './routes';
import mongoose from 'mongoose'
import * as dotenv from 'dotenv' 
dotenv.config({ path: `.env${process.env.NODE_ENV}` });

const app: Express = express();
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