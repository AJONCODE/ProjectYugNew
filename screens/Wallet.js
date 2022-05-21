import {
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';

import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

import walletImage from '../images/pay.jpg';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
  },
  walletsAndRadioButtonDiv: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    // alignItems: 'baseline',
  },
  walletInfo: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftIcon: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const Wallet = ({ navigation }) => {
  const [walletListLoading, setWalletListLoading] = React.useState(false);
  const [wallets, setWallets] = React.useState(null);
  const [fesschainWallets, setFesschainWallets] = React.useState(null);
  // false -> FESSCHAIN WALLET; true -> NORMAL WALLET
  const [walletSwitch, setWalletSwitch] = React.useState(false);

  const fetchWalletInfo = async () => {
    setWalletListLoading(true);
    if (!walletSwitch) {
      let fesschainWalletData = await AsyncStorage.getItem('fesschainWallets');
      fesschainWalletData = JSON.parse(fesschainWalletData);
      // console.info('YugWalletData:', fesschainWalletData);

      setFesschainWallets(fesschainWalletData);

      setWalletListLoading(false);
    } else {
      let walletsData = await AsyncStorage.getItem('wallets');
      walletsData = JSON.parse(walletsData);
      // console.info('walletsData: ', walletsData);

      setWallets(walletsData);
      setWalletListLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWalletInfo();
    }, [walletSwitch]),
  );

  // const handleTransferModal = () => {
  //   navigation.navigate('Transfer-Ether');
  // };

  const handleWalletInfoModal = (
    walletName,
    walletAddress,
    walletPrivateKey,
  ) => {
    navigation.navigate('Wallet-Stats', {
      walletName,
      address: walletAddress,
      privateKey: walletPrivateKey,
    });
  };

  const handleFesschainWalletInfoModal = (
    fesschainWalletAddress,
    fesschainWalletname,
    fesschainPrivateKey,
  ) => {
    navigation.navigate('FesschainWalletInfoModal', {
      fesschainWalletAddress,
      fesschainWalletname,
      fesschainPrivateKey,
    });
  };

  const Item = ({ address, name, privateKey }) => (
    <TouchableOpacity
      onPress={() => handleWalletInfoModal(name, address, privateKey)}
    >
      <View style={styles.walletInfo}>
        <View style={{ alignSelf: 'center' }}>
          <Image source={walletImage} style={{ width: 70, height: 70 }} />
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '500' }}>{name}</Text>
          <Text style={{ fontSize: 15, fontWeight: '400' }}>
            {address.slice(0, 4)}...
            {address.slice(address.length - 12, address.length)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FesschainItem = ({ address, name, privateKey }) => (
    <TouchableOpacity
      onPress={() => handleFesschainWalletInfoModal(address, name, privateKey)}
    >
      <View style={styles.walletInfo}>
        <View style={{ alignSelf: 'center' }}>
          <Image source={walletImage} style={{ width: 70, height: 70 }} />
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '500' }}>{name}</Text>
          <Text style={{ fontSize: 15, fontWeight: '400' }}>
            {address.slice(0, 4)}...
            {address.slice(address.length - 12, address.length)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWallet = ({ item }) => (
    <Item
      address={wallets[item].address}
      name={wallets[item].name}
      privateKey={wallets[item].privateKey}
    />
  );

  const renderFesschainWallet = ({ item }) => (
    <FesschainItem
      address={fesschainWallets[item].address}
      name={fesschainWallets[item].name}
      privateKey={fesschainWallets[item].privateKey}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <View style={styles.walletsAndRadioButtonDiv}>
          <AppButton
            title="ADD WALLET &#8643;"
            titleSize={16}
            // backgroundColor="#008080"
            backgroundColor="#01102e"
            isDisabled={false}
            handlePress={() =>
              navigation.navigate('CreateWalletModalInWalletScreen')
            }
          />

          <Switch
            style={{ marginTop: 15 }}
            trackColor={{ false: '#e5e5e5', true: '#cccccc' }}
            thumbColor="#166da2"
            ios_backgroundColor="#cccccc"
            onValueChange={(value) => setWalletSwitch(value)}
            value={walletSwitch}
          />
        </View>

        {!walletSwitch && (
          <View
            style={{
              height: 45,
              backgroundColor: '#efefef',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
              width: '100%',
            }}
          >
            <Text style={styles.labelText}>Yug Wallets</Text>
          </View>
        )}

        {!walletSwitch &&
          !walletListLoading &&
          fesschainWallets &&
          Object.keys(fesschainWallets).length && (
            <FlatList
              // columnWrapperStyle={{ justifyContent: 'space-between' }}
              numColumns={1}
              data={Object.keys(fesschainWallets) || []}
              keyExtractor={(item) => item}
              renderItem={renderFesschainWallet}
            />
          )}

        {!walletListLoading &&
          !walletSwitch &&
          (!fesschainWallets || !Object.keys(fesschainWallets).length) && (
            <>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                No Wallet Found!
              </Text>
            </>
          )}

        {walletSwitch && (
          <View
            style={{
              height: 45,
              backgroundColor: '#efefef',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginBottom: 5,
              width: '100%',
            }}
          >
            <Text style={styles.labelText}>Other Wallets</Text>
          </View>
        )}

        {walletSwitch &&
          !walletListLoading &&
          wallets &&
          Object.keys(wallets).length && (
            <View
              style={{
                flex: 1,
                width: '100%',
              }}
            >
              <FlatList
                // columnWrapperStyle={{ justifyContent: 'space-between' }}
                numColumns={1}
                data={Object.keys(wallets) || []}
                keyExtractor={(item) => item}
                renderItem={renderWallet}
              />
            </View>
          )}

        {!walletListLoading &&
          walletSwitch &&
          (!wallets || !Object.keys(wallets).length) && (
            <>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                No Wallet Found!
              </Text>
            </>
          )}

        {walletListLoading && (
          <View style={[styles.containerCenter, styles.containerColor]}>
            <ActivityIndicator size="small" color="#004c73" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Wallet;
