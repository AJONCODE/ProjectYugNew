import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import axios from 'axios';

import AppButton from '../components/AppButton';

import { baseURL } from '../utils/fesschain';

import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';

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
  infoText: {
    color: '#a1a1a1',
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    // borderColor: '#ffd700',
    fontSize: 20,
    borderColor: '#308fd6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 20,
    height: 90,
  },
});

const FesschainImportWalletModal = ({ navigation, route }) => {
  const { fechainWalletName } = route.params;

  const [privateKeyInput, setPrivateKeyInput] = React.useState('');
  const [importWalletLoading, setImportWalletLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setImportWalletLoading(true);
      const result = await axios.post(
        'http://68.183.94.159/HashGenerator/SelectHashDetail.php',
        {
          private_key: privateKeyInput.trim(),
        },
      );
      // console.warn(
      //   'Import Fesschain Wallet: result.data.result: ',
      //   result.data.result,
      // );

      const fesschainWalletAddress = result.data.result;

      let fessWallets =
        JSON.parse(await AsyncStorage.getItem('fesschainWallets')) || {};

      if (!fesschainWalletAddress) {
        Alert.alert('Invalid Private Key!');
        setImportWalletLoading(false);
      } else if (fessWallets[fesschainWalletAddress]) {
        Alert.alert('Wallet already exists');
        setImportWalletLoading(false);
      } else {
        fessWallets[fesschainWalletAddress] = {
          name: fechainWalletName,
          address: fesschainWalletAddress,
          privateKey: privateKeyInput,
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
        setImportWalletLoading(false);

        await redirectToWallet();
      }
    } catch (err) {
      console.log('error: ', err);
      setImportWalletLoading(false);
    }
  };

  const redirectToWallet = () => {
    navigation.popToTop();
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: `Import ${fechainWalletName} Wallet (Step 2)`,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, styles.containerColor]}>
          <TextInput
            style={styles.input}
            placeholder="Private Key"
            value={privateKeyInput}
            onChangeText={setPrivateKeyInput}
            multiline={true}
          />
          <Text style={styles.infoText}>
            Typically 64 alphanumeric characters
          </Text>

          <AppButton
            title="Import Wallet"
            isDisabled={privateKeyInput.trim() ? false : true}
            handlePress={!importWalletLoading && handleSubmit}
            loading={importWalletLoading}
            loadingText="IMPORTING WALLET"
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default FesschainImportWalletModal;
