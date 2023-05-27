import pidusage from 'pidusage';
import v8 from 'v8';
import fs from 'fs';
import path from 'path';
import onFinished from 'on-finished';
import { NextFunction } from 'express';
import Web3 from 'web3';

let cpu: string;
let totalCpu: number = 0;
let memory: string;
let totalMemory: number = 0;
let count: number = 0;
let heapUsage: string;

const buildMemoryAvg = () => {
  const amount = totalMemory / count;

  return `${amount.toFixed(1)}MB`;
};
const buildTotalCpuAvg = () => {
  const amount = totalCpu / count;

  return `${amount.toFixed(1)}%`;
};

const timestamp = new Date().getTime();
const dir = path.resolve(__dirname, 'log');

/**
 * Record the start time.
 * @private
 */

function recordStartTime(this: any): void {
  //mede o tempo de execução
  this._startAt = process.hrtime();
  this._startTime = new Date();
}

var requistionCount = 0;
var RequisitionSucess = 0;
var RequisitionFails = 0;

var amountGasUsed: number = 0;

function setGasUsed(gasUsed: number): void {
  if (gasUsed) {
    amountGasUsed += gasUsed;
  }
}

//Monitora as requisições realizadas
function logger(req: any, res: any, next: NextFunction, io: any) {
  // request data
  req._startAt = undefined;
  req._startTime = undefined;

  // response data
  res._startAt = undefined;
  res._startTime = undefined;

  recordStartTime.call(req);

  function logRequest() {
    requistionCount++;
    recordStartTime.call(res);
    if (!req._startAt || !res._startAt) {
      return;
    }
    // calculate diff
    let ms =
      (res._startAt[0] - req._startAt[0]) * 1e3 +
      (res._startAt[1] - req._startAt[1]) * 1e-6;
    // url
    let url = req.originalUrl || req.url;

    let statusCode = res.statusCode;

    let method = req.method;

    if (statusCode > 399) {
      RequisitionFails++;
    }

    if (statusCode >= 200 && statusCode <= 399) {
      RequisitionSucess++;
    }

    let data = `
        Todas as informações da requisição: ${method} ${url} ${statusCode} ${ms.toFixed(
      3
    )}ms;\n
        Método: ${method};\n
        URL: ${url};\n
        statusCode: ${statusCode};\n
        Tempo de respostas: ${ms.toFixed(3)}ms;\n
        Total de unidade de gás utilizado: ${amountGasUsed}\n
        Total de requisições: ${requistionCount};\n
        Total de requisições com sucesso: ${RequisitionSucess};\n
        Total de requisições com falha: ${RequisitionFails};\n
        ------------------------------------
        `;
    io.emit('requisition', {
      method,
      url,
      statusCode,
      responseTime: ms.toFixed(3),
      amountGasUsed,
      requistionCount,
      RequisitionSucess,
      RequisitionFails,
    });

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.appendFile(
      path.resolve(__dirname, 'log', `APIRequisitionLog-${timestamp}.txt`),
      data,
      (err) => {
        if (err) throw err;
      }
    );
  }

  // no final da requisição essa função é chamada
  onFinished(res, logRequest);

  next();
}

export const downloadRequisition = (req: any, res: any, next: NextFunction) => {
  const filePath = path.join(
    __dirname,
    'log',
    `APIRequisitionLog-${timestamp}.txt`
  );
  const fileName = path.basename(filePath);

  console.log(filePath);

  res.download(filePath, fileName, (err: any) => {
    if (err) {
      console.error('Erro ao fazer o download do arquivo:', err);
      res.status(500).send('Erro ao fazer o download do arquivo.');
    }
  });
};

export const downloadHardware = (req: any, res: any, next: NextFunction) => {
  const filePath = path.join(
    __dirname,
    'log',
    `APIMonitoringLog-${timestamp}.txt`
  );
  const fileName = path.basename(filePath);

  res.download(filePath, fileName, (err: any) => {
    if (err) {
      console.error('Erro ao fazer o download do arquivo:', err);
      res.status(500).send('Erro ao fazer o download do arquivo.');
    }
  });
};
//Monitora os recursos utilizados pela API
const compute = (cb: any, io: any) => {
  pidusage(process.pid, function (err, stats) {
    cpu = `${stats.cpu.toFixed(1)}%`;
    totalCpu = totalCpu + Number(stats.cpu.toFixed(1));
    memory = `${(stats.memory / 1024 / 1024).toFixed(1)}MB`;
    totalMemory = totalMemory + Number((stats.memory / 1024 / 1024).toFixed(1));
    heapUsage = `${(
      v8.getHeapStatistics().total_heap_size /
      1024 /
      1024
    ).toFixed(1)}MB`;
    count++;

    let data = `
    CPU: ${cpu};\n
    Memória: ${memory};\n
    Média de uso da pilha: ${heapUsage};\n
    Média de uso de CPU: ${buildTotalCpuAvg()};\n
    Média de uso de Memória: ${buildMemoryAvg()};\n
    ------------------------------------
    `;

    io.emit('hardware monitor', {
      cpu,
      memory,
      heapUsage,
      avgTotalCPU: buildTotalCpuAvg(),
      avgTotalMemory: buildMemoryAvg(),
    });

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.appendFile(
      path.resolve(__dirname, 'log', `APIMonitoringLog-${timestamp}.txt`),
      data,
      (err) => {
        if (err) throw err;
      }
    );

    cb();
  });
};

const interval = (time: number, io: any) => {
  setTimeout(() => {
    compute(() => {
      interval(time, io);
    }, io);
  }, time);
};

const networkEndpoint = {
  ganache: 'http://127.0.0.1:7545',
  fantom: 'https://rpc.testnet.fantom.network/',
  avalanche: 'https://api.avax-test.network/ext/bc/C/rpc',
};

const selectNetwork = (network: 'ganache' | 'fantom' | 'avalanche'): any => {
  const UrlConnection = networkEndpoint[network] ?? null;

  if (UrlConnection === null) {
    throw new Error('Invalid Network');
  }

  const provider = new Web3.providers.HttpProvider(UrlConnection);
  const { eth } = new Web3(provider);

  return eth;
};

export { interval, logger, selectNetwork, setGasUsed };
