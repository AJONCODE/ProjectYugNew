import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Unorderedlist from 'react-native-unordered-list';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import AppButton from '../components/AppButton';

import { isFesschainWalletNameExist } from '../utils/isWalletNameExist';
import { baseURL } from '../utils/fesschain';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  walletInfo: {
    marginTop: 15,
    padding: 20,
    minHeight: '40%',
    borderColor: '#dadfe3',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    // borderColor: '#ffd700',
    borderColor: '#308fd6',
    borderWidth: 1,
    padding: 20,
    fontSize: 20,
    borderRadius: 5,
    marginTop: 20,
  },
});

const CreateFesschainWalletScreen = ({ navigation }) => {
  const [walletNameInput, setWalletNameInput] = React.useState('');
  const [
    createFesschainWalletLoading,
    setCreateFesschainWalletLoading,
  ] = React.useState(false);

  // console.info('walletNameInput: ', walletNameInput);
  const createFesschainWallet = async () => {
    try {
      setCreateFesschainWalletLoading(true);
      const exists = await isFesschainWalletNameExist(walletNameInput.trim());
      console.info('exists: ', exists);

      if (!exists) {
        // const result = await axios.post(`${baseURL.fesschain_node}wallet`, {});
        const result = await axios.post(
          'http://68.183.94.159/HashGenerator/InsertHash.php',
          {},
        );
        console.info('result.data: ', result.data);
        const fesschainWalletAddress = result.data.wallet_id;
        const fesschainWalletPrivateKey = result.data.result;

        if (fesschainWalletAddress && fesschainWalletPrivateKey) {
          // add to wallet array
          let fessWallets =
            JSON.parse(await AsyncStorage.getItem('fesschainWallets')) || {};

          fessWallets[fesschainWalletAddress] = {
            name: walletNameInput,
            address: fesschainWalletAddress,
            privateKey: fesschainWalletPrivateKey,
            // mnemonic,
          };
          await AsyncStorage.setItem(
            'fesschainWallets',
            JSON.stringify(fessWallets),
          );

          const notificationToken = await AsyncStorage.getItem(
            'notificationToken',
          );

          await axios.put(`${baseURL.fesspay_server}notification/add-address`, {
            notificationToken: JSON.parse(notificationToken),
            address: fesschainWalletAddress,
            walletType: 'fesschain',
          });

          Alert.alert('Yug wallet created successfully.');
          setCreateFesschainWalletLoading(false);

          await redirectToWallet();
        }
      } else {
        Alert.alert('Wallet name already exists');
        setCreateFesschainWalletLoading(false);
      }
    } catch (err) {
      console.error('createYugWallet: error: ', err);
      setCreateFesschainWalletLoading(false);
      Alert.alert('Server is down! Please try again later.');
    }
  };

  const redirectToWallet = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.walletInfo}>
            <Text style={styles.headerText}>Set name</Text>
            <Unorderedlist style={{ fontSize: 30, top: 10 }}>
              <Text style={styles.infoText}>
                A wallet name is used to help you distinguish different accounts
                from one another.
              </Text>
            </Unorderedlist>
            <TextInput
              style={styles.input}
              placeholder="1-14 characters"
              value={walletNameInput}
              onChangeText={setWalletNameInput}
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
              title="SUBMIT"
              isDisabled={walletNameInput ? false : true}
              handlePress={
                !createFesschainWalletLoading && createFesschainWallet
              }
              loading={createFesschainWalletLoading}
              loadingText="SUBMITING"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreateFesschainWalletScreen;
