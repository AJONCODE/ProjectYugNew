import {
  Alert,
  AppRegistry,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import Clipboard from 'expo-clipboard';

import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { ethers } from 'ethers';
import etherscan from 'etherscan-api';
// import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  MaterialIcons,
  FontAwesome,
} from '@expo/vector-icons';
import React from 'react';
import { tokenABI } from '../utils/token.abi';

import send from '../images/wallet/send.png';
import receive from '../images/wallet/receive.png';
import chat from '../images/wallet/sendrec.png';
import ethereum from '../images/wallet/eth.png';
import bsc from '../images/wallet/binance-logo.png';

import { baseURL } from '../utils/fesschain';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  containerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  walletInfo: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
    // flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletAddressDiv: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    // borderColor: '#ffd700',
    borderColor: '#308fd6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    height: 40,
    // backgroundColor: 'teal',
    backgroundColor: '#01102e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const WalletInfoModal = ({ navigation, route }) => {
  const { address, privateKey } = route.params;
  const walletName = route.params.walletName
    ? `${route.params.walletName}'s Wallet`
    : 'Wallet';
  // console.info('walletName')

  const [screenLoading, setScreenLoading] = React.useState(true);
  const [
    fetchTokenListOptionsLoading,
    setFetchTokenListOptionsLoading,
  ] = React.useState(false);
  const [walletBalance, setWalletBalance] = React.useState('');
  // const [address, setAddress] = React.useState('');
  // const [privateKey, setPrivateKey] = React.useState('');
  const [tokenListOptions, setTokenListOptions] = React.useState([]);
  // const [tokenListOptions, setTokenListOptions] = React.useState([
  //   {
  //     tokenName: 'BNB',
  //     address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  //     balance: 0,
  //     symbol: 'BNB',
  //   },
  //   {
  //     tokenName: 'Tether USD',
  //     address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //     balance: 0,
  //     symbol: 'USDT',
  //   },
  // ]);

  React.useEffect(() => {
    navigation.setOptions({
      title: `${walletName} Stats`,
    });
  }, []);

  const deleteWalletAction = async (address) => {
    let ethereumWalletsObj = await AsyncStorage.getItem('wallets');
    ethereumWalletsObj = JSON.parse(ethereumWalletsObj);

    delete ethereumWalletsObj[address];

    await AsyncStorage.setItem('wallets', JSON.stringify(ethereumWalletsObj));

    // const notificationToken = await AsyncStorage.getItem('notificationToken');

    // await axios.put(`${baseURL.fesspay_server}notification/remove-address`, {
    //   notificationToken: JSON.parse(notificationToken),
    //   address,
    //   walletType: 'ethereum',
    // });

    Alert.alert('Ethereum Wallet successfully deleted!');
    navigation.popToTop();
  };

  const handleDeleteWallet = ({ address }) => {
    Alert.alert(
      'Delete Wallet!',
      'Are you sure, you want to delete the wallet!',
      [
        {
          text: 'OK',
          onPress: () => deleteWalletAction(address),
        },
        {
          text: 'Cancel',
          onPress: () => console.info('Delete Wallet action denied!'),
          style: 'cancel',
        },
      ],
    );
  };

  const handleEtherscanLink = async () => {
    try {
      Linking.openURL(`https://testnet.bscscan.com/address/${address}`);
    } catch (err) {
      console.log('handleEtherscanLink: err: ', err);
    }
  };

  const getBalance = async () => {
    try {
      // mainnet
      //let provider = ethers.getDefaultProvider('homestead');
      const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })
      console.log('getbalance: address: ', address);

      const balance = await bscProvider.getBalance(address);
      console.log('balance: ', ethers.utils.formatEther(balance));

      setWalletBalance(ethers.utils.formatEther(balance).toString());
    } catch (err) {
      console.log('Error getBalance: ', err);
    }
  };

  const handleExportPrivateKey = () => {
    navigation.navigate('ExportPrivateKeyModal', {
      privateKey,
    });
  };

  const redirectToWalletAssetInfoScreen = (token) => {
    navigation.navigate('WalletAssetInfoModal', {
      ...token,
      walletAddress: address
    });
  };

  const handleCopyAddress = () => {
    // copy to clipboard
    Clipboard.setString(address);

    // alert
    Alert.alert('Address copied successfully');
  };

  const fetchBalance = React.useCallback(async () => {
    await getBalance();
    setScreenLoading(false);
  }, []);

  const tokenOptionsFetch = React.useCallback(async () => {
    try {
      setFetchTokenListOptionsLoading(true);
      let wallet = new ethers.Wallet(privateKey);
      // console.info('wallet: ', wallet);
      const etherscanApi = await etherscan.init(
        'Y52U8S5ZIII2Q58527WT5U3NRPNMMFSPQK',
      );
      const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })
      const provider = ethers.getDefaultProvider('homestead');
      wallet = wallet.connect(bscProvider);

      const tokenArrObj =
        JSON.parse(await AsyncStorage.getItem('tokenArrObj')) || {};
      const tokenArr = tokenArrObj[address] || [];
      console.log('tokenOptionsFetch: tokenArr: ', tokenArr);
      let options = [];
      tokenArr.map(async (tokenAddress, index) => {
        let tokenInfo = {};

        // ABI
        // const contractAbiFragmentResponse = await etherscanApi.contract.getabi(
        //   tokenAddress,
        // );
        // const contractAbiFragment = await JSON.parse(
        //   contractAbiFragmentResponse.result,
        // );
        // console.log('contractAbiFragment: ', contractAbiFragment);

        // CONTRACT
        const contract = new ethers.Contract(
          tokenAddress,
          tokenABI,
          wallet,
        );
        // console.log('contract: ', contract);

        // Token Name
        const tokenName = await contract.name();
        // console.log('tokenName: ', tokenName);

        // Balance
        const balance = await contract.balanceOf(address);
        // console.log('balance: ', balance.toNumber());

        // Balance
        const symbol = await contract.symbol();
        // console.log('symbol: ', symbol);

        // const tokenData = await axios.get(
        //   `api.coingecko.com/api/v3/coins/${symbol}`,
        // );
        // console.info('tokenData: ', tokenData);
       
        tokenInfo = {
          tokenName: tokenName,
          address: tokenAddress,
          balance: ethers.utils.formatEther(balance).toString(),
          symbol: symbol,
        };

        // options.push('tokenInfo: ', tokenInfo);
        options[index] = tokenInfo;
        // console.log('options: ', options);
        // console.log('options.length: ', options.length);
        // console.log('tokenArr.length: ', tokenArr.length);
        if (options.length === tokenArr.length) {
          // console.log('options: ', options);
          setTokenListOptions(options);
          setFetchTokenListOptionsLoading(false);
        }
      });

      if (!tokenArr.length) {
        setFetchTokenListOptionsLoading(false);
      }
    } catch (err) {
      console.error('tokenOptionsFetch: Error: ', err);
      setFetchTokenListOptionsLoading(false);
    }
  }, []);

  const handleSendModal = () => {
    if (tokenListOptions.length) {
      navigation.navigate('TransferSelectiveTokenModal', {
        walletAddress: address,
        privateKey,
      });
    } else {
      Alert.alert('No tokens found for this wallet!');
    }
  };

  // React.useEffect(() => {
  //   console.log('every time user go back: tokenFetch');
  //   fetchBalance();
  //   tokenOptionsFetch();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('every time user go back: tokenFetch');
      fetchBalance();
      tokenOptionsFetch();
    }, []),
  );

  // React.useEffect(() => {
  //   console.warn('getBalance hit');
  //   getBalance();
  // }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getBalance();
  //   }, []),
  // );

  // React.useEffect(() => {
  //   setInterval(function () {
  //     console.warn('getBalance hit');
  //     getBalance();
  //   }, 1000 * 60 * 2);
  // }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {screenLoading && (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="small" color="#004c73" />
        </View>
      )}

      {!screenLoading && (
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.walletInfo}>
            {address && (
              <View style={styles.walletAddressDiv}>
                <Text style={{ fontSize: 18 }}>
                  {address.slice(0, 4)}...
                  {address.slice(address.length - 12, address.length)}
                </Text>

                <TouchableOpacity onPress={() => handleCopyAddress()}>
                  <AntDesign name="copy1" size={22} color="#707070" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleExportPrivateKey()}>
                  <Entypo name="export" size={22} color="#707070" />
                </TouchableOpacity>

                <MaterialCommunityIcons
                  name="desktop-mac-dashboard"
                  size={22}
                  color="#707070"
                  onPress={handleEtherscanLink}
                />
              </View>
            )}

            <View style={{ paddingVertical: 5, alignItems: 'center' }}>
              <Image source={bsc} style={{ width: 40, height: 40 }} />

              <Text
                style={{
                  color: '#308dd4',
                  fontSize: 50,
                  fontWeight: '700',
                }}
              >
                {Number(walletBalance).toFixed(4)}{' '}
                <Text
                  style={{
                    color: '#308dd4',
                    fontSize: 25,
                    fontWeight: '500',
                  }}
                >
                  BSC
                </Text>
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('RenameWallet', {
                    type: 'ethereum',
                    address: address,
                  })
                }
              >
                <FontAwesome name="edit" size={25} color="#707070" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDeleteWallet({ address: address })}
              >
                <MaterialCommunityIcons
                  name="delete-alert-outline"
                  size={25}
                  color="tomato"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('AddTokenModal', {
                  address,
                  privateKey,
                })
              }
            >
              <View style={{ paddingVertical: 5 }}>
                <MaterialIcons
                  // style={{ backgroundColor: '#3e5bad' }}
                  name="add-circle"
                  size={60}
                  color="#e4e4e4"
                />
              </View>

              <Text>ADD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={handleSendModal}
              // onPress={() =>
              //   navigation.navigate('TransferSelectiveTokenModal', {
              //     walletAddress: address,
              //   })
              // }
            >
              <Image source={send} style={{ width: 70, height: 70 }} />
              <Text style={{ color: '#4e4e4e' }}>SEND</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('WalletQrCodeModal', {
                  address,
                  name: walletName,
                })
              }
            >
              <Image source={receive} style={{ width: 70, height: 70 }} />
              <Text style={{ color: '#4e4e4e' }}>RECEIVE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' ,marginTop : 15}}
              onPress={() =>
                navigation.navigate('AllTransactions', {
                  walletAddress : address,
                  privateKey : privateKey
                })
              }
            >
              <Image source={chat} style={{ width: 50, height: 50, marginBottom : 5 }} />
              <Text style={{ color: '#4e4e4e' }}>ALL TRXNS</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 50,
              backgroundColor: '#efefef',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 20,
            }}
          >
            <View
              style={{
                width: '50%',
                alignItems: 'flex-start',
              }}
            >
              <Text style={styles.labelText}>Assets</Text>
            </View>
            <View
              style={{
                width: '50%',
                alignItems: 'flex-end',
              }}
            >
              <Text style={styles.labelText}>Value</Text>
            </View>
          </View>

          {fetchTokenListOptionsLoading && (
            <View style={{ paddingVertical: 15 }}>
              <ActivityIndicator size="small" color="#004c73" />
            </View>
          )}

          {!fetchTokenListOptionsLoading && !tokenListOptions.length && (
            <View style={{ paddingVertical: 15 }}>
              <Text>No Tokens Found!</Text>
            </View>
          )}

          {!fetchTokenListOptionsLoading &&
            tokenListOptions.length > 0 &&
            tokenListOptions.map((token,index) => (
              <TouchableOpacity
              key={index}
                onPress={() => redirectToWalletAssetInfoScreen(token)}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}
                >
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>{token.symbol}</Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Text style={{ fontSize: 20, color: '#308dd4' }}>
                      {token.balance}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

          {/* <View style={styles.walletInfo}>
          {address && (
            <View>
              <Text>
                {address.slice(0, 5)}...
                {address.slice(address.length - 15, address.length)}
              </Text>
              <TouchableOpacity onPress={() => handleCopyMessage()}>
                <AntDesign name="copy1" size={20} color="#707070" />
              </TouchableOpacity>
            </View>
          )}
        </View> */}

          {/* <Text style={styles.labelText}>Public Key</Text> */}
          {/* <Text style={styles.input} selectable>
          {address}
        </Text> */}
        </View>
      )}

      {/* <TouchOpacity></TouchOpacity> */}
    </SafeAreaView>
  );
};

AppRegistry.registerComponent('WalletInfoModal', () => WalletInfoModal);

export default WalletInfoModal;
