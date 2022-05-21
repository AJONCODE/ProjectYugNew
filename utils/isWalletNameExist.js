import AsyncStorage from '@react-native-community/async-storage';

export const isWalletNameExist = async (walletName) => {
  let wallets = await AsyncStorage.getItem('wallets');

  // console.info(`wallets: ${JSON.stringify(wallets, null, 2)}`);

  if (!wallets) {
    return false;
  } else {
    wallets = JSON.parse(wallets);
  }

  let exists = false;

  Object.keys(wallets).map((address) => {
    // console.info('check name: ', walletName);
    // console.info('object name: ', wallets[address].name);
    if (wallets[address].name === walletName) {
      exists = true;
    }
  });

  return exists;
};

export const isFesschainWalletNameExist = async (walletName) => {
  let wallets = await AsyncStorage.getItem('fesschainWallets');

  // console.info(`wallets: ${JSON.stringify(wallets, null, 2)}`);

  if (!wallets) {
    return false;
  } else {
    wallets = JSON.parse(wallets);
  }

  let exists = false;

  Object.keys(wallets).map((address) => {
    // console.info('check name: ', walletName);
    // console.info('object name: ', wallets[address].name);
    if (wallets[address].name === walletName) {
      exists = true;
    }
  });

  return exists;
};
