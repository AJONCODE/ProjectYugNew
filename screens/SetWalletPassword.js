import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Unorderedlist from 'react-native-unordered-list';

import AppButton from '../components/AppButton';
import Loading from '../components/Loading';
import React from 'react';

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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  walletInfo: {
    marginTop: 75,
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
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

const SetWalletPassword = ({ navigation }) => {
  const [walletPasswordInput, setWalletPasswordInput] = React.useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <View style={styles.walletInfo}>
          <Text style={styles.headerText}>Set Password</Text>
          <Unorderedlist style={{ fontSize: 30, top: 10 }}>
            <Text style={styles.infoText}>
              Password is used to encrypt private keys, trasnfer funds, etc. So
              a strong password is necessary.
            </Text>
          </Unorderedlist>
          <Unorderedlist style={{ fontSize: 30, top: 10 }}>
            <Text style={styles.infoText}>
              Please be noted Yug Network does not store the password and cannot
              retrieve it for you.
            </Text>
          </Unorderedlist>
          <TextInput
            style={styles.input}
            placeholder="Enter Wallet Password"
            value={walletPasswordInput}
            onChangeText={setWalletPasswordInput}
          />
        </View>

        <Text style={styles.infoText}>
          To protect your assets, password should include:
        </Text>

        <AppButton
          title="Next Step"
          // backgroundColor="#008080"
          backgroundColor="#01102e"
          isDisabled={walletPasswordInput ? false : true}
          // handlePress={generateWallet}
          // handlePress={handleCreateWalletScreen}
          // loading={createWalletLoading}
          // loadingText="CREATE A NEW WALLET"
        />
      </View>
    </SafeAreaView>
  );
};

export default SetWalletPassword;
