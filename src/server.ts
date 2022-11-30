import express from 'express';
import routes from './routes';
import cors from 'cors';
import { interval, logger } from './status-monitor';

const app = express();

//middleware de recursos da API
interval(1000);

//middleware de monitoramento de requisições
app.use((req, res, next) => {
  logger(req, res, next);
});

// app.use(require('express-status-monitor')());
app.use(cors());
app.use(express.json());
app.use(routes);

export { app };
