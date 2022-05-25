import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { ethers } from 'ethers';
import etherscan from 'etherscan-api';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import { tokenABI } from '../utils/token.abi';

import AppButton from '../components/AppButton';
import { baseURL } from '../utils/fesschain';

const BaseUrl = `${baseURL.fesspay_server}`;

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
    width: Dimensions.get('window').width,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  safeArea: {
    flex: 1,
  },
  transferBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  labelText: {
    marginBottom: 10,
    color: '#c1c1c1',
  },
  input: {
    // borderColor: '#ffd700',
    borderColor: '#c1c1c1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
  dualInput: {
    flexDirection: 'row',
    width: '100%',
  },
  inputAddress: {
    borderColor: '#c1c1c1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
});

const TransferSelectiveTokenModal = ({ navigation, route }) => {
  const { walletAddress, privateKey } = route.params;

  const [screenLoading, setScreenLoading] = React.useState(true);
  const [tokenListOptions, setTokenListOptions] = React.useState([]);
  const [selectedToken, setSelectedToken] = React.useState('');
  const [fetchTokensLoading, setFetchTokensLoading] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [targetAddressInput, setTargetAddressInput] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [sendTokenLoading, setSendTokenLoading] = React.useState(false);

  const tokenOptionsFetch = async () => {
    try {
      setFetchTokensLoading(true);
      let wallet = new ethers.Wallet(privateKey);
      // const etherscanApi = await etherscan.init(
      //   'Y52U8S5ZIII2Q58527WT5U3NRPNMMFSPQK',
      // );
      const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })

      const provider = ethers.getDefaultProvider('homestead');
      wallet = wallet.connect(bscProvider);

      const tokenArrObj =
        JSON.parse(await AsyncStorage.getItem('tokenArrObj')) || {};
      const tokenArr = tokenArrObj[walletAddress] || [];
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
        const balance = await contract.balanceOf(walletAddress);
        // console.log('balance: ', balance.toNumber());

        // Balance
        const symbol = await contract.symbol();
        // console.log('symbol: ', symbol);

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
          setSelectedToken(JSON.stringify(options[0]));
          setFetchTokensLoading(false);
          setScreenLoading(false);
        }
      });

      if (tokenArr.length === 0) {
        setFetchTokensLoading(false);
        setScreenLoading(false);
      }
    } catch (err) {
      console.log('tokenOptionsFetch: Error: ', err);
      setFetchTokensLoading(false);
      setScreenLoading(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    try {
      // console.info('handleBarCodeScanned : hit: ', type, data);
      setScanned(true);
      if (hasPermission === null) {
        Alert.alert('Requesting for camera permission');
      }
      if (hasPermission === false) {
        Alert.alert('No access to camera');
      }

      if (data) {
        const scannedAddressArray = data.split('ethereum:');
        console.info('scannedAddressArray: ', scannedAddressArray);
        if (scannedAddressArray.length > 1) {
          setTargetAddressInput(scannedAddressArray[1]);
        } else {
          setTargetAddressInput(scannedAddressArray[0]);
        }
      }
      setScanned(false);
    } catch (err) {
      console.error('handleBarCodeScanned : err: ', err);
    }
  };

  const handleTokenTransfer = async (tokenAddress) => {
    try {
      // console.log('send token hit');
      setSendTokenLoading(true);

      let wallet = new ethers.Wallet(privateKey);
      let myAddress = walletAddress;
      // const etherscanApi = await etherscan.init(
      //   'Y52U8S5ZIII2Q58527WT5U3NRPNMMFSPQK',
      // );
      // // ABI
      // let contractAbiFragmentResponse = await etherscanApi.contract.getabi(
      //   tokenAddress,
      // );
      // // console.log('contractAbiFragmentResponse: ', contractAbiFragmentResponse);
      // const contractAbiFragment = await JSON.parse(
      //   contractAbiFragmentResponse.result,
      // );
      // console.log('contractAbiFragment: ', contractAbiFragment);

      // CONTRACT'
      // mainnet
      const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })

      const provider = ethers.getDefaultProvider('homestead');

      // testnet
      // const provider = ethers.getDefaultProvider('ropsten');

      wallet = wallet.connect(bscProvider);
      const contract = new ethers.Contract(
        tokenAddress,
        tokenABI,
        wallet,
      );
      // console.log('contract: ', contract);

      // How many tokens?
      const numberOfDecimals = 18;
      const numberOfTokens = ethers.utils.parseUnits(
        amount.toString(),
        numberOfDecimals,
      );

      // Send tokens
      // let overrides = {
      //   // The maximum units of gas for the transaction to use
      //   gasLimit: 23000,
      // };
      const tx = await contract.transfer(
        targetAddressInput,
        numberOfTokens
      );
      // const tx = await contract.transfer('sdfsdf', numberOfTokens, overrides);
      console.log('tx: ', tx);

      //Alert.alert(`Transaction Successfull. Transaction Hash: ${tx}`);

      setSendTokenLoading(false);

      if (tx) {
        Alert.alert(`Transaction Successfull. Transaction Hash: ${tx.hash}`);

        // the object at async storage will be of following structure : 

        // {
        //   "wallet_address" : {
        //     "token_address" : {
        //       "transaction_hash" : {
        //         .....transaction details to be stored
        //       }
        //     }
        //   }
        // }

        let transHash = tx.hash; //get transaction hash

        let trxns = JSON.parse(await AsyncStorage.getItem('transactions')) || {}; //get the stored transactions or empty object from storage

        console.log('trxn log1 :', trxns);


        if (Object.keys(trxns).length === 0) {
          let obj = {};
          let trxn = {};

          trxn[transHash] = {  
            from: walletAddress,
            to: targetAddressInput,
            trxnHash: tx.hash,
            amount: amount,
            date: Date.now(),
          }; //transaction object to be stored against a transaction hash as key

          obj[tokenAddress] = { ...trxn };
          trxns[walletAddress] = { ...obj }; //transaction object to be stored against a wallet hash as key
        } else {
          let obj = trxns[walletAddress]; //get the existing transaction object for a particular wallet
          let trxn = { ...obj };

          let trxnForAsset = trxn[tokenAddress]; //get the existing transaction object for a particular token

          trxnForAsset[transHash] = {
            from: walletAddress,
            to: targetAddressInput,
            trxnHash: tx.hash,
            amount: amount,
            date: Date.now(),
          };

          obj[tokenAddress] = { ...trxnForAsset }; //add to the existing transaction object for a particular token
          trxns[walletAddress] = { ...obj }; //add to the existing transaction object for a particular wallet
        }


        console.log('trxn log1 :', trxns);

        await AsyncStorage.setItem('transactions', JSON.stringify(trxns));

      } else {
        Alert.alert(`Transaction Failed. Transaction Hash: ${tx.hash}`)
      }

      // if (tx) {
      //   const result = await axios.post(`${BaseUrl}trxn`, {
      //     from: myAddress,
      //     to: targetAddressInput,
      //     trxnHash: tx,
      //     amount: numberOfTokens,
      //   });

      //   console.log(
      //     `trxn notification result: ${JSON.stringify(result.data, null, 2)}`,
      //   );
      // }
    } catch (err) {
      console.log('SEND TOKEN: ERROR: ', err.code);

      if (err.code === 'INSUFFICIENT_FUNDS') {
        Alert.alert('INSUFFICIENT FUND');
      }
      if (err.code === 'INVALID_ARGUMENT') {
        Alert.alert('INVALID ARGUMENT');
      }
      setSendTokenLoading(false);
    }
  };


  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('every time user go back: tokenFetch');
      tokenOptionsFetch();
    }, []),
  );

  // console.info('amount: ', amount);
  // console.info('selectedToken: ', selectedToken);
  // console.info('screenLoading: ', screenLoading);

  return (
    <SafeAreaView style={[styles.safeArea]}>
      {/* <KeyboardAvoidingView
        style={{ flex: 1, alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        // behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({ ios: 55, android: 500 })}
        // keyboardVerticalOffset={Platform.select({ ios: 500, android: 500 })}
      > */}

      {screenLoading && (
        <View style={[styles.containerLoading]}>
          <ActivityIndicator size="small" color="#004c73" />
        </View>
      )}

      {scanned && !screenLoading && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {scanned && !screenLoading && (
        <AppButton
          title="CANCEL SCAN"
          isDisabled={false}
          handlePress={() => setScanned(false)}
        />
      )}

      {!scanned &&
        !screenLoading &&
        tokenListOptions.length > 0 &&
        !fetchTokensLoading && (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, styles.containerColor]}>
              <View style={styles.transferBox}>
                <Text style={styles.labelText}>Transfer Wallet</Text>
                <TextInput
                  style={styles.inputAddress}
                  placeholder="Address"
                  value={walletAddress}
                  disabled={true}
                />

                <Text style={styles.labelText}>Receiving wallet</Text>
                <View style={styles.dualInput}>
                  <View style={{ width: '85%' }}>
                    <TextInput
                      style={styles.inputAddress}
                      placeholder="Receiving wallet"
                      value={targetAddressInput}
                      onChangeText={setTargetAddressInput}
                    />
                  </View>
                  <View
                    style={{
                      width: '15%',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="barcode-scan"
                      size={40}
                      // color="teal"
                      color="#b2b2b2"
                      onPress={() => setScanned(true)}
                    />
                  </View>
                </View>

                <Text style={styles.labelText}>Select Token</Text>
                <Picker
                  mode="dropdown"
                  selectedValue={selectedToken}
                  style={{ height: 55, borderColor: '#c1c1c1' }}
                  itemStyle={{ height: 45, fontSize: 16, fontWeight: '800' }}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedToken(itemValue)
                  }
                >
                  {tokenListOptions.map((token, index) => (
                    <Picker.Item
                      label={token.symbol}
                      value={JSON.stringify(token)}
                    />
                  ))}
                </Picker>

                <Text style={styles.labelText}>Amount</Text>
                <View style={styles.dualInput}>
                  <View style={{ width: '85%' }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Amount"
                      keyboardType="numeric"
                      value={String(amount)}
                      onChangeText={(text) => setAmount(Number(text || 0))}
                    />
                  </View>
                  <View style={{ width: '15%', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={{
                        borderColor: '#c1c1c1',
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingVertical: 12,
                        minWidth: '90%',
                      }}
                      onPress={() =>
                        setAmount(JSON.parse(selectedToken).balance)
                      }
                      disabled={!selectedToken}
                    >
                      <Text style={{ color: '#c1c1c1', textAlign: 'center' }}>
                        MAX
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View
                style={{
                  dispaly: 'flex',
                  flexDirection: 'column',
                  marginTop: 'auto',
                }}
              >
                <AppButton
                  title={'TRANSFER'}
                  isDisabled={!amount || amount == 0 || !targetAddressInput}
                  handlePress={() =>
                    handleTokenTransfer(JSON.parse(selectedToken).address)
                  }
                  loading={sendTokenLoading}
                  loadingText="TRANSFER"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}

      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default TransferSelectiveTokenModal;
