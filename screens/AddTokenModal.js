import {
  Dimensions,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import AppButton from '../components/AppButton';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ethers } from 'ethers';
import etherscan from 'etherscan-api';
import { tokenABI } from '../utils/token.abi';

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
  infoBox: {
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
  inputAddress: {
    borderColor: '#c1c1c1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
});

const AddTokenModal = ({ navigation, route }) => {
  const walletAddress = route.params.address;
  const { privateKey } = route.params;

  const [addressInput, setAddressInput] = React.useState('');
  const [addTokenLoading, setAddTokenLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!addressInput) {
      Alert.alert('Please enter a valid token address');
    } else {
      try {
        setAddTokenLoading(true);
        let wallet = new ethers.Wallet(privateKey);
        // console.log('add token hit!');
        // const etherscanApi = await etherscan.init(
        //   'Y52U8S5ZIII2Q58527WT5U3NRPNMMFSPQK',
        // );
        // // ABI
        // let contractAbiFragmentResponse = await etherscanApi.contract.getabi(
        //   addressInput.trim(),
        // );

        // const contractAbiFragment = await JSON.parse(
        //   contractAbiFragmentResponse.result,
        // );

        // contract
        const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })
        const provider = ethers.getDefaultProvider('homestead');
        wallet = wallet.connect(bscProvider);
        // const contract = new ethers.Contract(
        //   addressInput.trim(),
        //   tokenABI,
        //   wallet,
        // );
        // new ethers.Contract(addressInput, contractAbiFragment, wallet);

        const tokenArrObj =
          JSON.parse(await AsyncStorage.getItem('tokenArrObj')) || {};

        let tokenArr = [];
        if (tokenArrObj[walletAddress]) {
          tokenArr = tokenArrObj[walletAddress];
        }

        if (tokenArr.includes(addressInput.trim())) {
          Alert.alert('Duplicates Token');
          setAddTokenLoading(false);
        } else {
          tokenArr.unshift(addressInput.trim());
          tokenArrObj[walletAddress] = tokenArr;
          await AsyncStorage.setItem(
            'tokenArrObj',
            JSON.stringify(tokenArrObj),
          );
          // reset the input value
          setAddressInput('');
          setAddTokenLoading(false);
          Alert.alert('Token added successfully');
        }
      } catch (err) {
        console.log('handleAddToken: err: ', err);
        if (err === 'Invalid Address format') {
          Alert.alert('Invalid Address format');
        }
        if (err === 'Contract source code not verified') {
          Alert.alert('Contract source code not verified');
        }
        setAddTokenLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.infoBox}>
            <Text style={styles.labelText}>Token Address</Text>
            <TextInput
              style={styles.inputAddress}
              placeholder="Token Address"
              value={addressInput}
              onChangeText={setAddressInput}
            />
          </View>

          {/* <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
            }}
          > */}
          <AppButton
            title={'ADD TOKEN'}
            isDisabled={!addressInput}
            handlePress={!addTokenLoading && handleSubmit}
            loading={addTokenLoading}
            loadingText="ADDING TOKEN"
          />
          {/* </View> */}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddTokenModal;
