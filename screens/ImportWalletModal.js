import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ethers } from 'ethers';

import { baseURL } from '../utils/fesschain';

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
  importViaButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeImportViaButton: {
    borderBottomColor: '#04527b',
    borderBottomWidth: 4,
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
});

const ImportWalletModal = ({ navigation, route }) => {
  const { walletName } = route.params;
  // 0x72e7d51084b99159872f960b052f6421e513f59602a7d08bca278d6458904722
  // importWalletVia accepts either MNEMONIC_PHRASE or PRIVATE_KEY
  const [importWalletVia, setImportWalletVia] = React.useState(
    'MNEMONIC_PHRASE',
  );
  const [privateKeyInput, setPrivateKeyInput] = React.useState('');
  const [mnemonicPhraseInput, setMnemonicPhraseInput] = React.useState('');
  const [importWalletLoading, setImportWalletLoading] = React.useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      title: `Import ${walletName} Wallet (Step 2)`,
    });
  }, []);

  const handleImportViaMnemonicPhrase = () => {
    setPrivateKeyInput('');
    setImportWalletVia('MNEMONIC_PHRASE');
  };

  const handleImportViaPrivateKey = () => {
    setMnemonicPhraseInput('');
    setImportWalletVia('PRIVATE_KEY');
  };

  const handleSubmit = async () => {
    if (importWalletVia === 'PRIVATE_KEY' && !privateKeyInput) {
      Alert.alert('Please enter a valid private key!');
    } else if (importWalletVia === 'MNEMONIC_PHRASE' && !mnemonicPhraseInput) {
      Alert.alert('Please enter a valid mnemonic phrase!');
    } else {
      try {
        if (importWalletVia === 'PRIVATE_KEY') {
          // VIA PRIVATE KEY
          setImportWalletLoading(true);
          const wallet = new ethers.Wallet(privateKeyInput.trim());
          console.warn('wallet: imported: ', wallet);

          let wallets = JSON.parse(await AsyncStorage.getItem('wallets')) || {};

          if (wallets[wallet.address]) {
            Alert.alert('Wallet already exists');
            setImportWalletLoading(false);
          } else {
            wallets[wallet.address] = {
              name: walletName,
              address: wallet.address,
              privateKey: wallet.privateKey,
              mnemonic: wallet.mnemonic,
            };

            // console.info('wallets: ', wallets);

            await AsyncStorage.setItem('wallets', JSON.stringify(wallets));

            const notificationToken = await AsyncStorage.getItem(
              'notificationToken',
            );

            await axios.put(
              `${baseURL.fesspay_server}notification/add-address`,
              {
                notificationToken: JSON.parse(notificationToken),
                address: wallet.address,
                walletType: 'ethereum',
              },
            );

            setPrivateKeyInput('');
            setImportWalletLoading(false);
            await redirectToWallet();
          }
        } else {
          // VIA MNEMONIC PHRASE
          setImportWalletLoading(true);
          const wallet = new ethers.Wallet.fromMnemonic(
            mnemonicPhraseInput.trim(),
          );
          console.info('wallet: imported: ', wallet);

          let wallets = JSON.parse(await AsyncStorage.getItem('wallets')) || {};

          // console.info('wallets: ', wallets);

          // console.info('wallets[wallet.address]: ', wallets[wallet.address]);

          if (wallets[wallet.address]) {
            Alert.alert('Wallet already exists');
            setImportWalletLoading(false);
          } else {
            wallets[wallet.address] = {
              name: walletName,
              address: wallet.address,
              privateKey: wallet.privateKey,
              mnemonic: wallet.mnemonic,
            };

            await AsyncStorage.setItem('wallets', JSON.stringify(wallets));
            // await AsyncStorage.setItem('privateKey', wallet.privateKey);
            // await AsyncStorage.setItem('address', wallet.address);

            const notificationToken = await AsyncStorage.getItem(
              'notificationToken',
            );

            await axios.put(
              `${baseURL.fesspay_server}notification/add-address`,
              {
                notificationToken: JSON.parse(notificationToken),
                address: wallet.address,
                walletType: 'ethereum',
              },
            );

            setPrivateKeyInput('');
            setImportWalletLoading(false);
            await redirectToWallet();
          }
        }
      } catch (err) {
        console.log('error: ', err);
        if (err.code === 'INVALID_ARGUMENT') {
          Alert.alert('Please enter a valid private key');
        }
        setImportWalletLoading(false);
      }
    }
  };

  const redirectToWallet = React.useCallback(async () => {
    if (await AsyncStorage.getItem('wallets')) {
      navigation.popToTop();
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={{ flexDirection: 'row', height: 50, backgroundColor: '#efefef' }}
      >
        <TouchableOpacity
          onPressIn={handleImportViaMnemonicPhrase}
          style={[
            styles.importViaButton,
            importWalletVia === 'MNEMONIC_PHRASE' &&
              styles.activeImportViaButton,
          ]}
        >
          <Text>PHRASE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={handleImportViaPrivateKey}
          style={[
            styles.importViaButton,
            importWalletVia === 'PRIVATE_KEY' && styles.activeImportViaButton,
          ]}
        >
          <Text>PRIVATE</Text>
        </TouchableOpacity>
      </View>

      {importWalletVia === 'MNEMONIC_PHRASE' && (
        <View style={[styles.container, styles.containerColor]}>
          {/* <Text style={styles.headerText}>IMPORT WALLET</Text> */}
          {/* <Text style={styles.labelText}>Private Key</Text> */}
          <TextInput
            style={styles.input}
            placeholder="MNEMONIC PHRASE"
            value={mnemonicPhraseInput}
            onChangeText={setMnemonicPhraseInput}
            multiline={true}
          />
          <Text style={styles.infoText}>
            Typically 12 (sometimes 24) words separate by single spaces.
          </Text>

          <AppButton
            title="Import Wallet"
            isDisabled={mnemonicPhraseInput.trim() ? false : true}
            handlePress={handleSubmit}
            loading={importWalletLoading}
            loadingText="IMPORTING WALLET"
          />
        </View>
      )}

      {importWalletVia === 'PRIVATE_KEY' && (
        <View style={[styles.container, styles.containerColor]}>
          {/* <Text style={styles.headerText}>IMPORT WALLET</Text> */}
          {/* <Text style={styles.labelText}>Private Key</Text> */}
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
            handlePress={handleSubmit}
            loading={importWalletLoading}
            loadingText="IMPORTING WALLET"
          />

          {/* <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={importWalletLoading}
        >
          {importWalletLoading && (
            <Loading
              text="IMPORTING WALLET"
              defaultSize={false}
              spinnerImg={false}
            />
          )}
          {!importWalletLoading && (
            <Text style={styles.buttonText}>IMPORT</Text>
          )}
        </TouchableOpacity> */}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ImportWalletModal;
