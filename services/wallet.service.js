import { ethers } from "ethers";

const NETWORK = 97;

export const createRandomWallet = async () => {
  const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })
  //const networkProvider = await new ethers.getDefaultProvider(NETWORK);

  const wallet = await ethers.Wallet.createRandom({ provider: bscProvider });

  return wallet;
};