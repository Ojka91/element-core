import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from './routes';

const app: Express = express();
app.use(cors({ exposedHeaders: ['*', 'token'] }));
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes)

require('dotenv').config();

app.get('/health', async (_req: Request, res: Response) => {
  return res.send({status: 'ok'});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000')
});