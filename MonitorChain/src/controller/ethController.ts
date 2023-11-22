import { videoContract } from '../constants/contracts';
import { selectNetwork, setGasUsed } from '../status-monitor';
import handleAsyncError from '../errors/handlerasyncErrors';
// const db = require('../database/querys');

const gasPrice: string = '20000000000';
const eth = selectNetwork('ganache', gasPrice);

const createVideo = async (
  contentCreatorAddress: string,
  cpmValue: number,
  idenfierContent: string | number
) => {
  const contract = new eth.Contract(videoContract.abi as any);

  return handleAsyncError(async () => {
    eth.accounts.wallet.add(videoContract.privatekey);
    const gasUsed = await eth.estimateGas({ data: contract.bytecode }); // gás estimado no deploy do contrato

    const deployContract = await contract
      .deploy({
        data: videoContract.bytecode,
        arguments: [contentCreatorAddress, cpmValue],
      })
      .send({
        from: videoContract.addressPlatform,
        gas: 6721975,
        gasPrice: gasPrice,
        value: 0.02 * 1e18,
      });

    setGasUsed(gasUsed);

    // db.insertRow(idenfierContent, deployContract._address);

    return deployContract;
  });
};

const updateInfo = async (contractAddress: string, assistedTime: number) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  return handleAsyncError(async () => {
    eth.accounts.wallet.add(videoContract.privatekey);

    const response = await contract.methods.updateInfoVideo(assistedTime).send({
      from: videoContract.addressPlatform,
      gas: 6721975,
      gasPrice: gasPrice,
    });
    setGasUsed(response.gasUsed); //gás usado na requisição

    return response;
  });
};

const getInfoVideo = async (contractAddress: string) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);

  return handleAsyncError(async () => {
    const data = await contract.methods.getInfoVideo().call();
    const response = {
      totalViews: data.totalViews,
      retentionRate: data.retentionRate,
      totalViewingTime: data.totalViewingTime,
    };

    return response;
  });
};

const balanceOf = async (contractAddress: string) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);

  return handleAsyncError(async () => {
    const data = await contract.methods.balanceOf().call();
    // console.log(await db.selectAllContracts());
    console.log(data);

    return data;
  });
};

const addTransfer = async (
  contractAddress: string,
  accountAddress: string,
  percent: number
) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);

  return handleAsyncError(async () => {
    eth.accounts.wallet.add(videoContract.privatekey);

    const response = await contract.methods
      .addTransfer(accountAddress, percent)
      .send({
        from: videoContract.addressPlatform,
        gas: 6721975,
        gasPrice: gasPrice,
      });
    setGasUsed(response.gasUsed);

    return response;
  });
};

const removeTransfer = async (
  contractAddress: string,
  accountAddres: string
) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  return handleAsyncError(async () => {
    eth.accounts.wallet.add(videoContract.privatekey);

    const response = await contract.methods
      .removeTransferByAddress(accountAddres)
      .send({
        from: videoContract.addressPlatform,
        gas: 6721975,
        gasPrice: gasPrice,
      });
    setGasUsed(response.gasUsed);

    return response;
  });
};

const viewAccountsTransfer = async (contractAddress: string) => {
  const contract = new eth.Contract(videoContract.abi as any, contractAddress);
  return handleAsyncError(async () => {
    const data = await contract.methods.viewAccountsTransfer().call();
    console.log(data);
    return data;
  });
};

export = {
  createVideo,
  updateInfo,
  getInfoVideo,
  balanceOf,
  addTransfer,
  removeTransfer,
  viewAccountsTransfer,
};
