import pidusage from 'pidusage';
import v8 from 'v8';
import fs from 'fs';
import path from 'path';
import onFinished from 'on-finished';
import { NextFunction } from 'express';
import Web3 from 'web3';

let cpu;
let totalCpu = 0;
let memory;
let totalMemory = 0;
let count = 0;
let heapUsage;

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

//Monitora as requisições realizadas
function logger(req: any, res: any, next: NextFunction) {
  // request data
  req._startAt = undefined;
  req._startTime = undefined;

  // response data
  res._startAt = undefined;
  res._startTime = undefined;

  recordStartTime.call(req);

  requistionCount++;

  function logRequest() {
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

    if (statusCode > 299) {
      RequisitionFails++;
    }

    if (statusCode >= 200 && statusCode <= 299) {
      RequisitionSucess++;
    }

    let data = `
      All requisition information: ${method} ${url} ${statusCode} ${ms.toFixed(
      3
    )}ms;\n
      Method: ${method};\n
      URL: ${url};\n
      statusCode: ${statusCode};\n
      Response Time: ${ms.toFixed(3)}ms;\n
      Total request: ${requistionCount};\n
      Total Successful Requests: ${RequisitionSucess};\n
      Total failed requests: ${RequisitionFails};\n
      ------------------------------------
      `;

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

//Monitora os recursos utilizados pela API
const compute = (cb: any) => {
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
    Memory: ${memory};\n
    Average Stack Usage: ${heapUsage};\n
    Average CPU Usage: ${buildTotalCpuAvg()};\n
    Average Memory Usage: ${buildMemoryAvg()};\n
    ------------------------------------
    `;
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

const interval = (time: number) => {
  setTimeout(() => {
    compute(() => {
      interval(time);
    });
  }, time);
};

const networkEndpoint = {
  fantom: 'https://rpc.testnet.fantom.network/',
  avalanche: 'https://api.avax-test.network/ext/bc/C/rpc',
};

const selectNetwork = (network: 'fantom' | 'avalanche'): any => {
  const UrlConnection =
    network === 'fantom'
      ? networkEndpoint.fantom
      : network === 'avalanche'
      ? networkEndpoint.avalanche
      : null;

  if (UrlConnection === null) {
    throw new Error('Invalid Network');
  }

  const provider = new Web3.providers.HttpProvider(UrlConnection);
  const { eth } = new Web3(provider);

  return eth;
};

export { interval, logger, selectNetwork };
