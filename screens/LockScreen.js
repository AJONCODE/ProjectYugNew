import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipe: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeUpText: {
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  passcodeText: {
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.34,
    lineHeight: 25,
  },
  codeContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code1: {
    width: 13,
    height: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  code2: {
    width: 13,
    height: 13,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  codeIncorrect: {
    backgroundColor: '#990000',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    width: 282,
    height: 348,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    width: 75,
    height: 75,
    borderRadius: 75,
    margin: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: 0,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 25,
    marginLeft: 46,
    marginRight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.39,
    textAlign: 'center',
  },
});

const LockScreen = ({ navigation }) => {
  const [passcode, setPasscode] = React.useState(['', '', '', '', '', '']);
  const [invalidCode, setInvalidCode] = React.useState(false);

  let numbers = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 0 },
  ];

  const onPressNumber = async (num) => {
    const activePincode = await AsyncStorage.getItem('activePincode');

    let tempCode = passcode;
    for (let i = 0; i < tempCode.length; i++) {
      if (tempCode[i] === '') {
        tempCode[i] = num.toString();
        break;
      } else {
        continue;
      }
    }

    setPasscode([...tempCode]);

    if (tempCode.join('').length === 6) {
      const userPincode = tempCode.join('');
      console.log('activePincode: ', activePincode);
      console.log('userPincode: ', userPincode);
      if (activePincode === userPincode) {
        await navigation.navigate('Wallet');
      }
      if (activePincode !== userPincode) {
        setInvalidCode(true);
      }
    }
  };

  const onPressCancel = () => {
    let tempCode = passcode;
    for (let i = tempCode.length - 1; i >= 0; i--) {
      if (tempCode[i] !== '') {
        tempCode[i] = '';
        break;
      } else {
        continue;
      }
    }

    setPasscode([...tempCode]);
    setInvalidCode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0b5d8a', '#26a0da']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          // height: '100%',
        }}
      >
        <View style={styles.swipe}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../images/locked-icon.png')}
              style={{ width: 13.9, height: 20, marginRight: 8 }}
            />
            <Text style={styles.swipeUpText}>Swipe up to unlock</Text>
          </View>
          <View style={{ marginTop: 50 }}>
            <View>
              <Text style={styles.passcodeText}>Enter Passcode</Text>
            </View>
            <View style={styles.codeContainer}>
              {passcode.map((p, index) => {
                let style1 = p != '' ? styles.code2 : styles.code1;
                let style2 = invalidCode ? styles.codeIncorrect : '';
                return <View style={[style1, style2]} key={index} />;
              })}
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.numbersContainer}>
            {numbers.map((num) => {
              return (
                <TouchableOpacity
                  style={styles.number}
                  key={num.id}
                  onPress={() => onPressNumber(num.id)}
                >
                  <Text style={styles.numberText}>{num.id}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.buttons}>
          {/* <TouchableOpacity>
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity> */}
          <TouchableOpacity onPress={onPressCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LockScreen;
