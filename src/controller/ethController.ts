import { videoContract } from '../constants/contracts';
import { selectNetwork } from '../status-monitor';

const eth = selectNetwork('fantom');

export const updateInfo = async (
  contractAddress: string,
  assistedTime: number
) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  try {
    eth.accounts.wallet.add(
      '3364a709fdaf8aa63f6252b179de5a4e7d9b8cccf34d80a6fafdc55c5cd51cfc'
    );
    const response = await contract.methods.updateInfoVideo(assistedTime).send({
      from: '0xe0C227BC58e68603BE91D6D2d163bc07367c3315',
      gas: 6721975,
      gasPrice: 25000000000,
    });

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

export const balanceOf = async (contractAddress: string) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  try {
    const data = await contract.methods.balanceOf().call();

    console.log(data);

    return data;
  } catch (error: any) {
    console.log('OCORREU UM ERRO NA CONSULTA DO SALDO DO CONTRATO');
    console.log(error);
    throw new Error(error.message);
  }
};
