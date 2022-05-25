import {
  Alert,
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
// import etherscan from '../images/etherscan.png';

// import fesspay from '../images/logo.png';
// import fnir from '../images/fnir.png';

// const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  infoDiv: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
  },
  groupHeading: {
    paddingVertical: 15,
    // backgroundColor: 'teal',
    // backgroundColor: '#01102e',
    // backgroundColor: '#1172a1',
    backgroundColor: '#efefef',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  groupHeadingText: {
    // color: '#FFFFFF',
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  buttonGroup: {
    // paddingHorizontal: 10,
    // paddingVertical: 18,
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  buttonProps: {
    marginTop: 12,
  },
  button: {
    // height: 40,
    height: 60,
    // backgroundColor: '#008080',
    backgroundColor: '#01102e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 6,
    fontSize: 18,
  },
});

const Setting = ({ navigation }) => {
  const handleAuthModal = () => {
    navigation.navigate('Authentication');
  };

  const handlePrivacyPolicyModal = () => {
    navigation.navigate('Privacy-Policy');
  };

  return (
    <SafeAreaView style={[styles.container, styles.containerColor]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.infoDiv}>
          <View>
            <View style={styles.groupHeading}>
              <Text style={styles.groupHeadingText}>Wallet Setting</Text>
            </View>
            <View style={styles.buttonGroup}>
              <AppButton
                title="WALLET AUTHENTICATION"
                isDisabled={false}
                handlePress={handleAuthModal}
              />
              {/* <TouchableOpacity style={styles.button} onPress={handleAuthModal}>
              <MaterialCommunityIcons
                name="onepassword"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>WALLET AUTHENTICATION</Text>
            </TouchableOpacity> */}
            </View>
          </View>

          {/* <View>
          <View style={styles.groupHeading}>
            <Text style={styles.groupHeadingText}>Other Products</Text>
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
            <TouchableOpacity
              style={[styles.button, styles.buttonProps]}
              onPress={handleFnirFinanceLink}
            >
              <Image
                source={fnir}
                style={{ width: 35, height: 35, marginRight: 5 }}
              />
              <Text style={styles.buttonText}>Fnir Finance </Text>
            </TouchableOpacity>
          </View>
        </View> */}

          {/* <View>
            <View style={styles.groupHeading}>
              <Text style={styles.groupHeadingText}>Policy & Terms </Text>
            </View>
            <View style={styles.buttonGroup}>
              <AppButton
                title="PRIVACY POLICY"
                isDisabled={false}
                handlePress={handlePrivacyPolicyModal}
              /> */}
              {/* <TouchableOpacity
              style={styles.button}
              onPress={handlePrivacyPolicyModal}
            >
              <MaterialIcons
                name="important-devices"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Privacy Policy</Text>
            </TouchableOpacity> */}

              {/* <TouchableOpacity
              style={[styles.button, styles.buttonProps]}
              // onPress={handleFnirFinanceLink}
            >
              <MaterialIcons
                name="privacy-tip"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Terms & Conditions</Text>
            </TouchableOpacity> */}
            {/* </View>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
