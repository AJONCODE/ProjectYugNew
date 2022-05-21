import React from 'react';
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

import AppButton from '../components/AppButton';
import { baseURL } from '../utils/fesschain';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  containerLoading: {
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
  dualInput: {
    flexDirection: 'row',
    width: '100%',
  },
  labelText: {
    marginBottom: 10,
    color: '#c1c1c1',
  },
  input: {
    borderColor: '#c1c1c1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
});

const TransferFesschainWalletModal = ({ route }) => {
  const { fesschainWalletAddress } = route.params;

  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [toAddress, setToAddress] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [transferFessLoading, setTransferFessLoading] = React.useState(false);

  const changeIfNum = (num) => {
    if (num >= 0 && String(num).indexOf('.') === -1) {
      setAmount(Number(num));
    } else if (num >= 0) {
      setAmount(num);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    try {
      setScanned(true);
      if (hasPermission === null) {
        Alert.alert('Requesting for camera permission');
      }
      if (hasPermission === false) {
        Alert.alert('No access to camera');
      }

      if (data) {
        // console.info('data: ', data);
        setToAddress(data);
      }
      setScanned(false);
    } catch (err) {
      console.error('handleBarCodeScanned : err: ', err);
    }
  };

  const transferFess = async () => {
    try {
      // console.info('transferFess hit');
      setTransferFessLoading(true);
      const bodyData = {
        from: fesschainWalletAddress.trim(),
        to: toAddress.trim(),
        amount: amount * 100000,
      };

      const headers = {
        headers: {
          'content-type': 'application/json',
          token: baseURL.fesschain_node_token,
          accept: '*/*',
        },
      };
      const url = `${baseURL.fesschain_node}send`;

      const result = await axios.post(url, bodyData, headers);

      console.info('result.data.tx: ', result.data.txHash);

      Alert.alert(
        `Transaction successfull! Transaction Hash is ${result.data.txHash}`,
      );
      setAmount(0);
      setToAddress(null);
      setTransferFessLoading(false);

      if (result.data.txHash) {
        await axios.post(`${baseURL.fesspay_server}trxn`, {
          from: fesschainWalletAddress.trim(),
          to: toAddress.trim(),
          trxnHash: result.data.txHash,
          amount: amount,
        });
      }
    } catch (err) {
      console.log('Error transferYug: err.response.data', err.response.data);
      console.log('Error transferYug: err', err);
      setTransferFessLoading(false);
      if (
        !!err &&
        !!err.response &&
        !!err.response.data &&
        !!err.response.data.error
      ) {
        Alert.alert(err.response.data.error);
      } else {
        Alert.alert('Transaction Failed!');
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
    <SafeAreaView style={[styles.safeArea]}>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, styles.containerColor]}>
            <View style={styles.transferBox}>
              <Text style={styles.labelText}>
                Transfer Yug Wallet Address
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Transfer Yug Wallet Address"
                value={fesschainWalletAddress}
                disabled={true}
              />

              <Text style={styles.labelText}>
                Receiving Yug Wallet Address
              </Text>
              <View style={styles.dualInput}>
                <View style={{ width: '85%' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Receiving Yug Wallet Address"
                    value={toAddress}
                    onChangeText={setToAddress}
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
                    color="#b2b2b2"
                    onPress={() => setScanned(true)}
                  />
                </View>
              </View>

              <Text style={styles.labelText}>Amount (Yug)</Text>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="decimal-pad"
                value={String(amount)}
                onChangeText={(num) => changeIfNum(num)}
              />
            </View>

            <View
              style={{
                dispaly: 'flex',
                flexDirection: 'column',
                marginTop: 'auto',
              }}
            >
              <AppButton
                title={'TRANSFER Yug'}
                isDisabled={
                  !amount ||
                  amount == 0 ||
                  !toAddress ||
                  toAddress === fesschainWalletAddress
                }
                handlePress={() => !transferFessLoading && transferFess()}
                loading={transferFessLoading}
                loadingText="TRANSFERRING Yug"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default TransferFesschainWalletModal;
