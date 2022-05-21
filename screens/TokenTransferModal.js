import {
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import etherscan from 'etherscan-api';
import axios from 'axios';

import AppButton from '../components/AppButton';
import { baseURL } from '../utils/fesschain';

const BaseUrl = `${baseURL.fesspay_server}`;

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  labelText: {
    fontSize: 15,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  dualInput: {
    flexDirection: 'row',
    width: '100%',
  },
  inputAddress: {
    // borderColor: '#ffd700',
    borderColor: '#b8e2f2',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    // borderColor: '#ffd700',
    borderColor: '#b8e2f2',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});

const TokenTransferModal = ({ navigation, route }) => {
  const { tokenName } = route.params;
  const tokenAddress = route.params.address;

  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [targetAddressInput, setTargetAddressInput] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [sendTokenLoading, setSendTokenLoading] = React.useState(false);

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
        // console.info('data: ', data.slice('ethereum:'));
        setTargetAddressInput(data.slice('ethereum:'));
      }
      setScanned(false);
    } catch (err) {
      console.error('handleBarCodeScanned : err: ', err);
    }
  };

  const handleTokenTransfer = async () => {
    try {
      console.log('send token hit');
      setSendTokenLoading(true);

      let wallet = new ethers.Wallet(await AsyncStorage.getItem('privateKey'));
      let myAddress = await AsyncStorage.getItem('address');
      const etherscanApi = await etherscan.init(
        'Y52U8S5ZIII2Q58527WT5U3NRPNMMFSPQK',
      );
      // ABI
      let contractAbiFragmentResponse = await etherscanApi.contract.getabi(
        tokenAddress,
      );
      // console.log('contractAbiFragmentResponse: ', contractAbiFragmentResponse);
      const contractAbiFragment = await JSON.parse(
        contractAbiFragmentResponse.result,
      );
      // console.log('contractAbiFragment: ', contractAbiFragment);

      // CONTRACT'
      // mainnet
      const provider = ethers.getDefaultProvider('homestead');

      // testnet
      // const provider = ethers.getDefaultProvider('ropsten');

      wallet = wallet.connect(provider);
      const contract = new ethers.Contract(
        tokenAddress,
        contractAbiFragment,
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
      let overrides = {
        // The maximum units of gas for the transaction to use
        gasLimit: 23000,
      };
      const tx = await contract.transfer(
        targetAddressInput,
        numberOfTokens,
        overrides,
      );
      // const tx = await contract.transfer('sdfsdf', numberOfTokens, overrides);
      console.log('tx: ', tx);

      if (tx) {
        const result = await axios.post(`${BaseUrl}trxn`, {
          from: myAddress,
          to: targetAddressInput,
          trxnHash: tx,
          amount: numberOfTokens,
        });

        console.log(
          `trxn notification result: ${JSON.stringify(result.data, null, 2)}`,
        );
      }
      Alert.alert(`Transaction Successfull. Transaction Hash: ${tx}`);

      setSendTokenLoading(false);
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
    navigation.setOptions({
      title: `${tokenName} Transfer`,
    });

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.select({ ios: 55, android: 500 })}
    >
      {scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {scanned && (
        <AppButton
          title="CANCEL SCAN"
          isDisabled={false}
          handlePress={() => setScanned(false)}
        />
      )}

      {!scanned && (
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.container, styles.containerColor]}>
            {/* <Text style={styles.labelText}>Target Address</Text> */}
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e9e9e9',
                borderRadius: 10,
                padding: 10,
                marginBottom: 20,
              }}
            >
              <View style={styles.dualInput}>
                <View style={{ width: '85%' }}>
                  <TextInput
                    style={styles.inputAddress}
                    placeholder="Target Address"
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

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                //   maxLength={10}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <AppButton
              title={`TRANSFER ${tokenName}`}
              isDisabled={false}
              handlePress={handleTokenTransfer}
              loading={sendTokenLoading}
              loadingText="SENDING TOKEN"
            />
          </View>
        </SafeAreaView>
      )}
    </KeyboardAvoidingView>
  );
};

export default TokenTransferModal;
