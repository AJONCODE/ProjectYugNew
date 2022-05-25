import { useKeepAwake } from 'expo-keep-awake';
import { createRandomWallet } from '../services/wallet.service';

import axios from 'axios';

import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  View,
} from 'react-native';
import React from 'react';
// import { ethers } from 'ethers';
import Clipboard from 'expo-clipboard';

import AppButton from '../components/AppButton';
import { baseURL } from '../utils/fesschain';

const BaseUrl = `${baseURL.fesspay_server}`;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerColor: {
    backgroundColor: '#fff',
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  infoDiv: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 20,
  },
  mnemonicBlock: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    marginVertical: 8,
    width: '31%',
  },
  // backText: {
  //   color: '#eeeeee',
  //   position: 'absolute',
  //   top: -45,
  //   left: 0,
  //   fontSize: 60,
  //   fontWeight: '700',
  // },
  // backTextDoubleCenter: {
  //   left: -15,
  // },
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

const Item = ({ word }) => (
  <View style={styles.mnemonicBlock} key={word}>
    <Text style={{ fontSize: 19, textAlign: 'center' }}>{word}</Text>
  </View>
);

const CreateWalletMnemonic = ({ navigation, route }) => {
  useKeepAwake();

  const { walletName } = route.params;
  const [loading, setLoading] = React.useState(true);
  const [mnemonic, setMnemonic] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [privateKey, setPrivateKey] = React.useState('');

  const generateMnemonic = React.useCallback(async () => {
    console.info('generateMnemonic: hit');
    // const walletData = await ethers.Wallet.createRandom();
    // walletData.name = walletName;
    // setWallet(walletData);

    // console.info('walletData.mnemonic.phrase: ', walletData.mnemonic.phrase);
    // setMnemonic(walletData.mnemonic.phrase);
    // setLoading(false);

    //const result = await axios.get(`${BaseUrl}wallet`);

    const result = await createRandomWallet();
    const mnemonicFunction = result["_mnemonic"];
    const mnemonicObj = mnemonicFunction();

    const signingkeyFunction = result["_signingKey"];
    const signingObj = signingkeyFunction();

    console.info('result: CreateWallet', result);
    console.info('result.address ', result.address);
    
    console.info('result.data.data.mnemonic: ',signingObj);
    setAddress(result.address);
    setMnemonic( mnemonicObj.phrase);
    setPrivateKey(signingObj.privateKey);


    setLoading(false);
  }, []);

  const handleCopyMnemonic = () => {
    // copy to clipboard
    Clipboard.setString(mnemonic);

    // alert
    Alert.alert('Mnemonic copied successfully');
  };

  const nextStep = () => {
    // navigation.navigate('CreateWalletMnemonicConfirm');
    navigation.navigate('CreateWalletMnemonicConfirm', {
      walletName,
      address,
      mnemonic,
      privateKey,
    });
  };

  React.useEffect(() => {
    if (!mnemonic) {
      generateMnemonic();
    }
  }, []);

  const renderMnemonic = ({ item }) => <Item word={item} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && (
        <View style={[styles.containerCenter, styles.containerColor]}>
          <ActivityIndicator size="small" color="#004c73" />
        </View>
      )}

      {!loading && (
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.infoDiv}>
            <Text style={{ fontSize: 15, color: '#4297d7' }}>
              Here is your mnemonic for '{walletName}' wallet. Obtaining
              mnemonic equals owning all assets. Please store it safely. It can
              not be retrived it once it gets lost.
            </Text>
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <FlatList
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              numColumns={3}
              data={mnemonic.split(' ') || []}
              keyExtractor={(item) => item}
              renderItem={renderMnemonic}
            />
          </View>

          <AppButton
            title="COPY MNEMONIC"
            isDisabled={false}
            handlePress={handleCopyMnemonic}
            loading={false}
            loadingText="COPYING"
          />

          <AppButton
            title="I have saved it successfully"
            isDisabled={false}
            handlePress={nextStep}
            loading={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateWalletMnemonic;
