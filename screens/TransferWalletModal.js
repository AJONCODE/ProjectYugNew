import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Loading from '../components/Loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import { baseURL } from '../utils/fesschain';

const BaseUrl = `${baseURL.fesspay_server}`;

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  safeArea: {
    flex: 1,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    marginBottom: 10,
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
    // backgroundColor: '#008080',
    backgroundColor: '#01102e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dualInput: {
    flexDirection: 'row',
    width: '100%',
  },
  inputAddress: {
    // borderColor: '#ffd700',
    borderColor: '#308fd6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: Dimensions.get('window').width - 65,
  },
  scanButton: {
    paddingLeft: 5,
    width: 50,
  },
});

const TransferWalletModal = () => {
  const [sendToInput, setSendToInput] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [sendTransactionLoading, setSendTransactionLoading] = React.useState(
    false,
  );

  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    try {
      console.log('handleBarCodeScanned : hit: ', type, data);
      setScanned(false);
      if (hasPermission === null) {
        Alert.alert('Requesting for camera permission');
      }
      if (hasPermission === false) {
        Alert.alert('No access to camera');
      }
      // Alert.alert(
      //   `Bar code with type ${type} and data ${data} has been scanned!`,
      // );
      if (data) {
        setSendToInput(data);
      }
      setScanned(false);
    } catch (err) {
      console.log('handleBarCodeScanned : err: ', err);
    }
  };

  const handleSubmit = async () => {
    if (!sendToInput) {
      Alert.alert('Please enter a valid address');
    } else if (amount <= 0) {
      Alert.alert('Please enter a valid amount');
    } else {
      try {
        setSendTransactionLoading(true);
        let privateKey = await AsyncStorage.getItem('privateKey');
        let wallet = new ethers.Wallet(privateKey);
        const myAddress = await AsyncStorage.getItem('address');
        // mainnet
        const provider = ethers.getDefaultProvider('homestead');
        // testnet
        // const provider = ethers.getDefaultProvider('ropsten');

        let transaction = {
          to: sendToInput,
          value: ethers.utils.parseEther(`${amount}`),
        };

        // console.info('provider.getNetwork(): ', await provider.getNetwork());
        // console.info(
        //   'provider.getNetwork().chainId: ',
        //   await provider.getNetwork().chainId,
        // );

        // console.info('transaction: ', transaction);
        // console.info('wallet: ', wallet);

        const signTransaction = await wallet.signTransaction(transaction);
        console.info('signTransaction: ', signTransaction);
        wallet = wallet.connect(provider);
        const sendTransaction = await wallet.sendTransaction(transaction);
        console.info('sendTransaction: ', sendTransaction);
        console.info('sendTransaction.hash: ', sendTransaction.hash);
        console.info('myAddress: ', myAddress);
        console.info('sendToInput: ', sendToInput);
        console.info('amount: ', amount);

        if (sendTransaction.hash) {
          const result = await axios.post(`${BaseUrl}trxn`, {
            from: myAddress,
            to: sendToInput,
            trxnHash: sendTransaction.hash,
            amount: amount,
          });

          console.log(
            `trxn notification result: ${JSON.stringify(result.data, null, 2)}`,
          );
        }

        setTransactionHash(sendTransaction.hash);
        setSendToInput('');
        setAmount(0);
        setSendTransactionLoading(false);
        Alert.alert(`Trxn Hash: ${sendTransaction.hash}`);
      } catch (err) {
        console.log('SendTransaction: error: ', err.code);
        if (err.code === 'INSUFFICIENT_FUNDS') {
          Alert.alert('INSUFFICIENT FUND');
        }
        if (err.code === 'INVALID_ARGUMENT') {
          Alert.alert('INVALID ARGUMENT');
        }
        setSendTransactionLoading(false);
      }
    }
  };

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        {scanned && (
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}

        {scanned && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>CANCEL SCAN</Text>
          </TouchableOpacity>
        )}
        {!scanned && (
          <View>
            <Text style={styles.headerText} />
            <Text style={styles.labelText}>To</Text>
            <View style={styles.dualInput}>
              <TextInput
                style={styles.inputAddress}
                placeholder="Address"
                value={sendToInput}
                onChangeText={setSendToInput}
              />
              {/* <Button
                style={styles.scanButton}
                title={'SCAN'}
                onPress={() => setScanned(true)}
              /> */}
              <MaterialCommunityIcons
                name="barcode-scan"
                size={40}
                // color="teal"
                color="#01102e"
                style={styles.scanButton}
                onPress={() => setScanned(true)}
              />
            </View>
            <Text style={styles.labelText}>Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              //   maxLength={10}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={sendTransactionLoading}
            >
              {!!sendTransactionLoading && (
                <Loading
                  text="SENDING TRANSACTION"
                  defaultSize={false}
                  spinnerImg={false}
                />
              )}
              {!sendTransactionLoading && (
                <Text style={styles.buttonText}>SUBMIT</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TransferWalletModal;
