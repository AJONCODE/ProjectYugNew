import { SafeAreaView, StyleSheet, View } from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import React from 'react';

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
});

const TokenQrCodeModal = ({ navigation, route }) => {
  const { address, tokenName } = route.params;

  React.useEffect(() => {
    navigation.setOptions({
      title: `${tokenName} QR Code`,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <QRCode
          value={address}
          size={300}
          bgColor="#000000"
          fgColor="#FFFFFF"
        />
      </View>
    </SafeAreaView>
  );
};

export default TokenQrCodeModal;
