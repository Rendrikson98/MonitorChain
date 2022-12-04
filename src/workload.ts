import { workloadContract } from './status-monitor';

workloadContract({
  router: 'http://localhost:3000/getInfoVideo/',
  numberOfRequest: 10,
  requestMethod: 'GET',
});

//npx ts-node-esm test.ts
