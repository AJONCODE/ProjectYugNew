import {
  Alert,
  AppRegistry,
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import fesspay from '../images/logo.png';
import fnir from '../images/fnir.png';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  groupHeading: {
    width: width,
    padding: 25,
    backgroundColor: '#308fd6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupHeadingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  buttonGroup: {
    paddingHorizontal: 25,
    paddingVertical: 35,
  },
  buttonProps: {
    marginTop: 35,
  },
  button: {
    height: 60,
    backgroundColor: '#01102e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    fontSize: 18,
  },
});

const OurProductsModal = () => {
  const handleFesspayDashboardLink = async () => {
    try {
      Linking.openURL('https://fesspay.com/');
    } catch (err) {
      console.log('handleFesspayDashboard: err: ', err);
    }
  };

  // const handleFnirFinanceLink = async () => {
  //   try {
  //     const address = await AsyncStorage.getItem('address');
  //     Linking.openURL(`https://www.fnir.finance/home`);
  //   } catch (err) {
  //     console.log('handleEtherscanLink: err: ', err);
  //   }
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <View style={styles.groupHeading}>
          <Text style={styles.groupHeadingText}>OUR PRODUCTS</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleFesspayDashboardLink}
          >
            <Image
              source={fesspay}
              style={{ width: 30, height: 30, marginRight: 5 }}
            />
            <Text style={styles.buttonText}>Yug Network Wallet Dashboard</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.button, styles.buttonProps]}
            onPress={handleFnirFinanceLink}
          >
            <Image
              source={fnir}
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <Text style={styles.buttonText}>Fnir Finance </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

AppRegistry.registerComponent('OurProductsModal', () => OurProductsModal);

export default OurProductsModal;
