import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
// import Loading from '../components/Loading';
import AppButton from '../components/AppButton';

import React from 'react';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  safeArea: {
    flex: 1,
  },
  infoDiv: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
  },
  headerGroup: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    // paddingHorizontal: 6,
  },
  input: {
    // borderColor: '#ffd700',
    borderColor: '#308fd6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    height: 40,
    // backgroundColor: 'teal',
    backgroundColor: '#01102e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const AuthPincodeModal = ({ navigation }) => {
  const [pincodeInput, setPincodeInput] = React.useState('');
  const [pincodeInputConfirm, setPincodeInputConfirm] = React.useState('');
  const [activePincode, setActivePincode] = React.useState(null);

  const handleSubmit = async () => {
    if (pincodeInput.length != 6) {
      Alert.alert('Please enter a valid 6 digit pincode');
    } else if (pincodeInput !== pincodeInputConfirm) {
      Alert.alert('Pincode do not match');
    } else {
      try {
        await AsyncStorage.setItem('activePincode', pincodeInput);
        // await AsyncStorage.setItem('authNeeded', false);
        setActivePincode(pincodeInput);
      } catch (err) {
        console.log('handleSubmit: err: ', err);
      }
    }
  };

  const handleRemoveWalletPin = async () => {
    try {
      await AsyncStorage.removeItem('activePincode');
      setActivePincode(null);
      setPincodeInput('');
      setPincodeInputConfirm('');
    } catch (err) {
      console.log('handleRemoveWalletPin: err: ', err);
    }
  };

  React.useEffect(() => {
    (async () => {
      setActivePincode(await AsyncStorage.getItem('activePincode'));
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {!activePincode && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, styles.containerColor]}>
            <View style={styles.infoDiv}>
              <View style={styles.headerGroup}>
                <Text style={styles.headerText}>AUTHENTICATION DETAILS</Text>
              </View>
              <Text style={styles.labelText}>Pin Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Pincode (6 numbers)"
                keyboardType="numeric"
                minLength={6}
                maxLength={6}
                value={pincodeInput}
                onChangeText={setPincodeInput}
              />
              <Text style={styles.labelText}>Confirm Pin Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Pincode (6 numbers)"
                keyboardType="numeric"
                minLength={6}
                maxLength={6}
                value={pincodeInputConfirm}
                onChangeText={setPincodeInputConfirm}
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
                isDisabled={
                  pincodeInput.length !== 6 || pincodeInputConfirm.length !== 6
                }
                handlePress={handleSubmit}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {!!activePincode && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, styles.containerColor]}>
            <View style={styles.infoDiv}>
              <View style={styles.headerGroup}>
                <Text style={styles.headerText}>AUTHENTICATION DETAILS</Text>
              </View>
              <Text style={styles.labelText}>Wallet Pin Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                keyboardType="numeric"
                maxLength={6}
                value={activePincode}
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
                title="REMOVE PIN"
                isDisabled={!activePincode}
                handlePress={handleRemoveWalletPin}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default AuthPincodeModal;
