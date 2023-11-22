import pidusage from 'pidusage';
import v8 from 'v8';
import fs from 'fs';
import path from 'path';
import onFinished from 'on-finished';
import { NextFunction } from 'express';
import Web3 from 'web3';
import fetch from 'node-fetch';

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

var quoteCryptoCurrency = 0;
var cryptoCurrency = 'ETH';
var gasPrice = 0;

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

    let costTransactions: number = Number(
      (
        (gasPrice / 1000000000 / 1000000000) *
        amountGasUsed *
        quoteCryptoCurrency
      ).toFixed(4)
    );

    if (!costTransactions) {
      costTransactions = 0;
    }

    let data = `
    All request information: ${method} ${url} ${statusCode} ${ms.toFixed(
      3
    )}ms;\n
        Method: ${method};\n
        URL: ${url};\n
        statusCode: ${statusCode};\n
        Response time: ${ms.toFixed(3)}ms;\n
        Total unit of gas used: ${amountGasUsed}\n
        Total requests: ${requistionCount};\n
        Total successful requests: ${RequisitionSucess};\n
        Total failed requests: ${RequisitionFails};\n
        Total cost(US$): ${costTransactions};\n
        Current cryptocurrency price(US$): ${quoteCryptoCurrency};\n
        cryptocurrency: ${cryptoCurrency};\n
        Gas Price(Gwei): ${gasPrice}
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
      cryptoCurrency,
      costTransactions,
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
    Memory: ${memory};\n
    Average stack usage: ${heapUsage};\n
    Average CPU Usage: ${buildTotalCpuAvg()};\n
    Average memory Usage: ${buildMemoryAvg()};\n
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

// const networkEndpoint = {
//   ganache: 'http://127.0.0.1:7545',
//   fantom: 'https://rpc.testnet.fantom.network/',
//   avalanche: 'https://api.avax-test.network/ext/bc/C/rpc',
// };

type Network = {
  ganache: {
    params: string;
    currency: string;
    endpoint: string;
  };
  fantom: {
    params: string;
    currency: string;
    endpoint: string;
  };
  avalanche: {
    params: string;
    currency: string;
    endpoint: string;
  };
};

const networkcurrency: Network = {
  ganache: {
    params: 'ethereum',
    currency: 'ETH',
    endpoint: 'http://127.0.0.1:7545',
  },
  fantom: {
    params: 'fantom',
    currency: 'FTM',
    endpoint: 'https://rpc.testnet.fantom.network/',
  },
  avalanche: {
    params: 'avalanche-2',
    currency: 'AVAX',
    endpoint: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
};

async function currentQuote(network: 'ganache' | 'fantom' | 'avalanche') {
  try {
    const date = new Intl.DateTimeFormat('pt-BR')
      .format(new Date())
      .replace('/', '-')
      .replace('/', '-');

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${networkcurrency[network].params}/history?date=${date}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const responseJSON = await response.json();
    quoteCryptoCurrency = responseJSON.market_data.current_price.usd.toFixed(2);
    cryptoCurrency = networkcurrency[network].currency;
  } catch (error) {
    console.error(error);
    quoteCryptoCurrency = 1;
  }
}

const selectNetwork = (
  network: 'ganache' | 'fantom' | 'avalanche',
  currentGasPrice = '20000000000'
): any => {
  const UrlConnection = networkcurrency[network].endpoint ?? null;
  gasPrice = Number(currentGasPrice);

  currentQuote(network);

  if (UrlConnection === null) {
    throw new Error('Invalid Network');
  }

  const provider = new Web3.providers.HttpProvider(UrlConnection);
  const { eth } = new Web3(provider);

  return eth;
};

export { interval, logger, selectNetwork, setGasUsed };
