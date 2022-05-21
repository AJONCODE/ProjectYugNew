import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../components/AppButton';
// import Loading from '../components/Loading';
import React from 'react';

// import Clipboard from 'expo-clipboard';
import { baseURL } from '../utils/fesschain';

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
    marginBottom: 10,
  },
  mnemonicInputDiv: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  infoDivShuffledMnemonic: {
    padding: 10,
    // backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 10,
  },
  mnemonicBlock: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f8f9fa',
    width: '32%',

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  shuffledMnemonicBlock: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f8f9fa',
    width: '32%',

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});

const CreateWalletMnemonicConfirm = ({ navigation, route }) => {
  const { walletName, address, mnemonic, privateKey } = route.params;
  const [loading, setLoading] = React.useState(true);
  const [originalMnemonic, setOriginalMnemonic] = React.useState('');
  const [shuffledMnemonic, setShuffledMnemonic] = React.useState('');
  const [confirmedMnemonic, setConfirmedMnemonic] = React.useState('');
  const [createWalletLoading, setCreateWalletLoading] = React.useState(false);

  const shuffleMnemonic = (mnemonic) => {
    const array = mnemonic.split(' ');
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const handleSelectShuffledMnemonicWord = (index) => {
    // console.info('index: ', index);
    if (index > -1) {
      const arrayShuffledMnemonic = shuffledMnemonic.split(' ');
      const word = arrayShuffledMnemonic[index];

      // console.info('confirmedMnemonic.split: ', confirmedMnemonic.split(' '));

      let arrayConfirmedMnemonic = confirmedMnemonic
        ? confirmedMnemonic.split(' ')
        : [];
      arrayConfirmedMnemonic.push(word);

      setConfirmedMnemonic(arrayConfirmedMnemonic.join(' '));

      // console.info('arrayShuffledMnemonic: ', arrayShuffledMnemonic);
      for (let i = 0; i < arrayShuffledMnemonic.length; i++) {
        if (i === index) {
          arrayShuffledMnemonic.splice(i, 1);
        }
      }
      // console.info('arrayShuffledMnemonic: ', arrayShuffledMnemonic);

      setShuffledMnemonic(arrayShuffledMnemonic.join(' '));
    }
  };

  const handleSelectConfirmMnemonicWord = (index) => {
    if (index > -1) {
      const arrayConfirmedMnemonic = confirmedMnemonic.split(' ');
      const word = arrayConfirmedMnemonic[index];

      let arrayShuffledMnemonic = shuffledMnemonic
        ? shuffledMnemonic.split(' ')
        : [];
      arrayShuffledMnemonic.push(word);

      setShuffledMnemonic(arrayShuffledMnemonic.join(' '));

      // console.info('arrayConfirmedMnemonic: ', arrayConfirmedMnemonic);
      for (let i = 0; i < arrayConfirmedMnemonic.length; i++) {
        if (i === index) {
          arrayConfirmedMnemonic.splice(i, 1);
        }
      }
      // console.info('arrayConfirmedMnemonic: ', arrayConfirmedMnemonic);

      setConfirmedMnemonic(arrayConfirmedMnemonic.join(' '));
    }
  };

  const handleSubmitMnemonic = async () => {
    if (originalMnemonic !== confirmedMnemonic) {
      // alert
      Alert.alert('Invalid Mnemonic Order! Please try again.');
    } else {
      setCreateWalletLoading(true);
      // console.info('privateKey: ', privateKey);
      // console.info('address: ', address);
      let wallets = JSON.parse(await AsyncStorage.getItem('wallets')) || {};

      wallets[address] = {
        name: walletName,
        address,
        privateKey,
        mnemonic,
      };
      await AsyncStorage.setItem('wallets', JSON.stringify(wallets));

      const notificationToken = await AsyncStorage.getItem('notificationToken');

      const addAddressBody = {
        notificationToken: JSON.parse(notificationToken),
        address,
        walletType: 'ethereum',
      };

      console.info('addAddressBody: ', addAddressBody);

      await axios.put(
        `${baseURL.fesspay_server}notification/add-address`,
        addAddressBody,
      );

      setCreateWalletLoading(false);
      await redirectToWallet();
    }
  };

  const redirectToWallet = React.useCallback(async () => {
    if (await AsyncStorage.getItem('wallets')) {
      setCreateWalletLoading(false);
      navigation.popToTop();
    }
  }, []);

  React.useEffect(() => {
    setOriginalMnemonic(mnemonic);
    const shuffledMnemonicData = shuffleMnemonic(mnemonic).join(' ');
    setShuffledMnemonic(shuffledMnemonicData);
    setConfirmedMnemonic('');
    setLoading(false);
  }, []);

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
              To ensure that you have to transcribe the mnemonics in the correct
              order, select the word in order of original mnemonic.
            </Text>
          </View>

          <View style={styles.mnemonicInputDiv}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: 10,
              }}
            >
              {originalMnemonic.split(' ').map((item, index) => (
                <View style={styles.mnemonicBlock}>
                  <TouchableOpacity
                    disabled={
                      confirmedMnemonic.split(' ')[index] ? false : true
                    }
                    onPress={() => handleSelectConfirmMnemonicWord(index)}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {confirmedMnemonic.split(' ')[index]
                        ? confirmedMnemonic.split(' ')[index]
                        : index + 1}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {originalMnemonic.split(' ').length !==
              confirmedMnemonic.split(' ').length && (
              <View style={styles.infoDivShuffledMnemonic}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#4297d7',
                    paddingBottom: 10,
                    textAlign: 'center',
                  }}
                >
                  Shuffled Mnemonic
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}
                >
                  {shuffledMnemonic.split(' ').map((item, index) => (
                    <View style={styles.shuffledMnemonicBlock}>
                      <TouchableOpacity
                        onPress={() => handleSelectShuffledMnemonicWord(index)}
                      >
                        <Text style={{ fontSize: 19 }}>{item}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {originalMnemonic.split(' ').length ===
            confirmedMnemonic.split(' ').length && (
            <View
              style={{
                // flex: 1,
                // flexDirection: 'column',
                marginTop: 'auto',
              }}
            >
              <AppButton
                title="SUBMIT"
                handlePress={!createWalletLoading && handleSubmitMnemonic}
                loading={createWalletLoading}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateWalletMnemonicConfirm;
