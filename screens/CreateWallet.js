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

import React from 'react';

import AppButton from '../components/AppButton';

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

const CreateWallet = ({ navigation }) => {
  // const [createWalletLoading, setCreateWalletLoading] = React.useState(false);
  const [walletNameInput, setWalletNameInput] = React.useState('');

  // console.info('walletNameInput: ', walletNameInput);
  const nextStep = async () => {
    const exists = await isWalletNameExist(walletNameInput.trim());
    // console.info('exists: ', exists);

    if (!exists) {
      navigation.navigate('CreateWalletMnemonic', {
        walletName: walletNameInput.trim(),
      });
    } else {
      Alert.alert('Wallet name already exists');
    }
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
              title="NEXT"
              isDisabled={walletNameInput ? false : true}
              handlePress={nextStep}
              loading={false}
              loadingText="SUBMITING"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreateWallet;
