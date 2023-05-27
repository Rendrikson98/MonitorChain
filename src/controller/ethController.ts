import { videoContract } from '../constants/contracts';
import { selectNetwork, setGasUsed } from '../status-monitor';

const eth = selectNetwork('ganache');

export const updateInfo = async (
  contractAddress: string,
  assistedTime: number
) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  try {
    eth.accounts.wallet.add(
      '0x7f80d85ddf1279737caece1c19c62e3384316e9c58cf1902333f92b08fb1c51d'
    );

    const response = await contract.methods.updateInfoVideo(assistedTime).send({
      from: videoContract.addressPlatform,
      gas: 6721975,
      gasPrice: 25000000000,
    });
    setGasUsed(response.gasUsed); //gás usado na requisição

    return response;
  } catch (error: any) {
    console.log('OCORREU UM ERRO NA ATUALIZAÇÃO');
    console.log(error);
    throw new Error(error.message);
  }
};

export const getInfoVideo = async (contractAddress: string) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  try {
    const data = await contract.methods.getInfoVideo().call();
    const response = {
      totalViews: data.totalViews,
      retentionRate: data.retentionRate,
      totalViewingTime: data.totalViewingTime,
    };

    return response;
  } catch (error: any) {
    console.log('OCORREU UM ERRO NA BUSCA');
    console.log(error);
    throw new Error(error.message);
  }
};
