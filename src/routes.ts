import express from 'express';
import {
  balanceOf,
  getInfoVideo,
  updateInfo,
} from './controller/ethController';

const routes = express.Router();

routes.get('/', (req: any, res: any, next: any) => {
  return res.json({
    message: 'ok',
  });
});

routes.patch('/updateVideo', async (req: any, res: any) => {
  try {
    const response = await updateInfo(
      '0xBFc6A00D8E7b3A2b63Ef598C7488cCED737f90A2', //address contract in network fantom
      60
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

routes.get('/getInfoVideo', async (req: any, res: any) => {
  try {
    const response = await getInfoVideo(
      '0xBFc6A00D8E7b3A2b63Ef598C7488cCED737f90A2'
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
routes.get('/balanceOf', async (req: any, res: any) => {
  try {
    const response = await balanceOf(
      '0xBFc6A00D8E7b3A2b63Ef598C7488cCED737f90A2'
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default routes;
