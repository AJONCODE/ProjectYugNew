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
import AsyncStorage from '@react-native-async-storage/async-storage';

import Unorderedlist from 'react-native-unordered-list';

import React from 'react';

import AppButton from '../components/AppButton';

import { isFesschainWalletNameExist } from '../utils/isWalletNameExist';
import { isWalletNameExist } from '../utils/isWalletNameExist';

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

const RenameWallet = ({ navigation, route }) => {
  const { type, address } = route.params;

  const [walletNameInput, setWalletNameInput] = React.useState('');
  const [renamingWalletLoading, setRenamingWalletLoading] = React.useState(
    false,
  );

  const handleRenamingWallet = async () => {
    setRenamingWalletLoading(true);
    const fesschainWalletNameExists = await isFesschainWalletNameExist(
      walletNameInput.trim(),
    );
    const ethereumWalletNameExists = await isWalletNameExist(
      walletNameInput.trim(),
    );

    if (type === 'fesschain' && !fesschainWalletNameExists) {
      let fesschainWalletsObj = await AsyncStorage.getItem('fesschainWallets');
      fesschainWalletsObj = JSON.parse(fesschainWalletsObj);

      fesschainWalletsObj[address] = {
        ...fesschainWalletsObj[address],
        name: walletNameInput,
      };

      await AsyncStorage.setItem(
        'fesschainWallets',
        JSON.stringify(fesschainWalletsObj),
      );

      setRenamingWalletLoading(false);
      setWalletNameInput('');

      navigation.popToTop();
    } else if (type === 'ethereum' && !ethereumWalletNameExists) {
      let ethereumWalletsObj = await AsyncStorage.getItem('wallets');
      ethereumWalletsObj = JSON.parse(ethereumWalletsObj);

      ethereumWalletsObj[address] = {
        ...ethereumWalletsObj[address],
        name: walletNameInput,
      };

      await AsyncStorage.setItem('wallets', JSON.stringify(ethereumWalletsObj));

      setRenamingWalletLoading(false);
      setWalletNameInput('');

      navigation.popToTop();
    } else {
      Alert.alert('Wallet name already exists');
      setRenamingWalletLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.walletInfo}>
            <Text style={styles.headerText}>Rename Wallet Name</Text>
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
              title="RENAME WALLET"
              isDisabled={walletNameInput ? false : true}
              handlePress={handleRenamingWallet}
              loading={renamingWalletLoading}
              loadingText="RENAMING WALLET"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default RenameWallet;
