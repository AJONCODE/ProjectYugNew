import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';

import AppButton from '../components/AppButton';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  containerColor: {
    backgroundColor: '#fff',
  },
  walletContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderStyle: 'solid',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoDiv: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    marginBottom: 15,
  },
});

const CreateWalletModalInWalletScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <View style={styles.walletContainer}>
          <View style={styles.infoDiv}>
            <Text style={{ fontSize: 15, color: '#4297d7' }}>
              Here you can create your very own Yug wallet!
            </Text>
          </View>

          <AppButton
            title="CREATE Yug WALLET"
            isDisabled={false}
            handlePress={() =>
              navigation.navigate('CreateFesschainWalletScreen')
            }
            loading={false}
            loadingText="CREATING Yug WALLET"
          />

          <AppButton
            title="IMPORT Yug WALLET"
            isDisabled={false}
            handlePress={() =>
              navigation.navigate('FesschainImportWalletNameModal')
            }
            loading={false}
            loadingText="IMPORTING Yug WALLET"
          />
        </View>

        <View style={styles.walletContainer}>
          <View style={styles.infoDiv}>
            <Text style={{ fontSize: 15, color: '#4297d7' }}>
              Here you can create or import your very own wallet!
            </Text>
          </View>

          <AppButton
            title="CREATE WALLET"
            isDisabled={false}
            loadingText="CREATING WALLET"
            handlePress={() => navigation.navigate('CreateWallet')}
          />
          <AppButton
            title="IMPORT WALLET"
            isDisabled={false}
            loadingText="IMPORTING WALLET"
            handlePress={() => navigation.navigate('ImportWalletNameModal')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateWalletModalInWalletScreen;
