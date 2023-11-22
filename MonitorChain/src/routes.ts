import express from 'express';
const { getInfoVideo, updateInfo } = require('./controller/ethController');
const routes = express.Router();

routes.get('/', (req: any, res: any, next: any) => {
  return res.json({
    message: 'ok',
  });
});

routes.patch('/updateVideo', async (req: any, res: any) => {
  try {
    const response = await updateInfo(
      '0x8a114600f5f2649ed014EC587f40BE479abd99ee', //address contract in network fantom
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
      '0x8a114600f5f2649ed014EC587f40BE479abd99ee'
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default routes;
