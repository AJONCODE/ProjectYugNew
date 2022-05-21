import { SafeAreaView, StyleSheet, View, Text, Alert } from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import React from 'react';
import Clipboard from 'expo-clipboard';

import AppButton from '../components/AppButton';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  textBlue: {
    color: '#308dd4',
    fontWeight: '600',
    paddingVertical: 20,
  },
  textGrey: {
    color: '#7c7c7c',
    fontWeight: '600',
    paddingBottom: 20,
  },
});

const WalletQrCodeModal = ({ navigation, route }) => {
  const { address, name } = route.params;
  console.info('route.params: ', route.params);

  const handleCopyAddress = () => {
    // copy to clipboard
    Clipboard.setString(address);

    // alert
    Alert.alert('Address copied successfully');
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: `${name || 'Wallet'} QR Code`,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <Text style={[styles.textBlue, { fontSize: 30 }]}>
          Scan QR code and pay
        </Text>
        <QRCode
          value={address}
          size={250}
          bgColor="#000000"
          fgColor="#FFFFFF"
        />
        <Text style={[styles.textBlue, { fontSize: 30 }]}>
          {name || 'Wallet'}
        </Text>
        <Text style={[styles.textGrey, { fontSize: 25 }]}>
          {address.slice(0, 4)}...
          {address.slice(address.length - 10, address.length)}
        </Text>

        <AppButton
          title="COPY THE WALLET ADDRESS"
          titleSize={20}
          // backgroundColor="#008080"
          backgroundColor="#01102e"
          isDisabled={false}
          handlePress={handleCopyAddress}
        />
      </View>
    </SafeAreaView>
  );
};

export default WalletQrCodeModal;
