import express from 'express';
import routes from './routes';
import cors from 'cors';
import {
  downloadHardware,
  downloadRequisition,
  interval,
  logger,
} from './status-monitor';
const http = require('http');
const app = express();
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server);

//middleware de recursos da API
interval(1000, io);

//middleware de monitoramento de requisições
app.use((req, res, next) => {
  logger(req, res, next, io);
});

// app.use(require('express-status-monitor')());
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

app.get('/downloadRequisition', (req, res, next) => {
  downloadRequisition(req, res, next);
});
app.get('/downloadHardware', (req, res, next) => {
  downloadHardware(req, res, next);
});

app.use(routes);

export { server };
