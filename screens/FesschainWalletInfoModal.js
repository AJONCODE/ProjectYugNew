import React from 'react';

import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  FontAwesome,
} from '@expo/vector-icons';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Clipboard from 'expo-clipboard';
import { useFocusEffect } from '@react-navigation/native';

import { baseURL } from '../utils/fesschain';

import send from '../images/wallet/send.png';
import receive from '../images/wallet/receive.png';
import chat from '../images/wallet/chat.png';
import fess from '../images/wallet/fess.png';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  containerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  walletInfo: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
    // flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletAddressDiv: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  TransactionInfo: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const FesschainWalletInfoModal = ({ navigation, route }) => {
  const {
    fesschainWalletAddress,
    fesschainWalletname,
    fesschainPrivateKey,
  } = route.params;

  const [screenLoading, setScreenLoading] = React.useState(true);
  const [trxnHistory, setTrxnHistory] = React.useState([]);
  const [trxnHistoryLoading, setTrxnHistoryLoading] = React.useState(false);
  const [fesschainWalletBalance, setFesschainWalletBalance] = React.useState(
    null,
  );

  React.useEffect(() => {
    navigation.setOptions({
      title: `${fesschainWalletname}'s Stats`,
    });
  }, []);

  const deleteWalletAction = async (address) => {
    let fesschainWalletsObj = await AsyncStorage.getItem('fesschainWallets');
    fesschainWalletsObj = JSON.parse(fesschainWalletsObj);

    delete fesschainWalletsObj[address];

    await AsyncStorage.setItem(
      'fesschainWallets',
      JSON.stringify(fesschainWalletsObj),
    );

    const notificationToken = await AsyncStorage.getItem('notificationToken');

    await axios.put(`${baseURL.fesspay_server}notification/remove-address`, {
      notificationToken: JSON.parse(notificationToken),
      address,
      walletType: 'fesschain',
    });

    Alert.alert('Yug Wallet successfully deleted!');
    navigation.popToTop();
  };

  const handleDeleteWallet = ({ address }) => {
    Alert.alert(
      'Delete Wallet!',
      'Are you sure, you want to delete the wallet!',
      [
        {
          text: 'OK',
          onPress: () => deleteWalletAction(address),
        },
        {
          text: 'Cancel',
          onPress: () => console.info('Delete Wallet action denied!'),
          style: 'cancel',
        },
      ],
    );
  };

  const handleExportPrivateKey = () => {
    navigation.navigate('ExportPrivateKeyModal', {
      privateKey: fesschainPrivateKey,
    });
  };

  const handleFesschainAddressCopy = () => {
    // copy to clipboard
    Clipboard.setString(fesschainWalletAddress);

    // alert
    Alert.alert('Address copied successfully');
  };

  const handleFesschainExplorerLink = async () => {
    try {
      Linking.openURL(
        `https://explorer.fess.network/search?address=${fesschainWalletAddress}`,
      );
    } catch (err) {
      console.log('handleYugExplorerLink: err: ', err);
    }
  };

  const handleFesschainExplorerTrxnHashLink = async (trxnHash) => {
    try {
      Linking.openURL(`https://explorer.fess.network/search?tx=${trxnHash}`);
    } catch (err) {
      console.log('handleYugExplorerTrxnHashLink: err: ', err);
    }
  };

  const getTransactionHistory = async () => {
    try {
      setTrxnHistoryLoading(true);
      const result = await axios.get(
        `${baseURL.fesschain_node}getAddressHistory?asd=${fesschainWalletAddress}&page=0`,
      );
      // console.info('result.data.data: ', result.data.data);

      setTrxnHistoryLoading(false);
      setTrxnHistory(result.data.data);
    } catch (err) {
      console.log('Error getTransactionHistory: ', err);
      setTrxnHistoryLoading(false);
    }
  };

  const getBalance = async () => {
    if (!fesschainWalletBalance) {
      try {
        const result = await axios.post(
          `${baseURL.fesschain_node}balance?address=${fesschainWalletAddress}`,
        );
        // console.info('result.data.balance: ', result.data.balance);

        setScreenLoading(false);
        setFesschainWalletBalance(result.data.balance);
      } catch (err) {
        console.log('Error getBalance: ', err);
        setScreenLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(async () => {
      await getBalance();
      await getTransactionHistory();
    }, []),
  );

  const Item = ({ trxHash }) => (
    <View style={styles.TransactionInfo} key={trxHash}>
      <TouchableOpacity
        onPress={() => handleFesschainExplorerTrxnHashLink(trxHash)}
      >
        <Text style={{ fontSize: 15, textAlign: 'center' }}>
          {trxHash.slice(0, 5)}...
          {trxHash.slice(trxHash.length - 25, trxHash.length)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrxn = ({ item }) => <Item trxHash={item} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      {screenLoading && (
        <View style={[styles.containerLoading, styles.containerColor]}>
          <ActivityIndicator size="small" color="#004c73" />
        </View>
      )}

      {!screenLoading && (
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.walletInfo}>
            {fesschainWalletAddress && (
              <View style={styles.walletAddressDiv}>
                <Text style={{ fontSize: 18 }}>
                  {fesschainWalletAddress.slice(0, 4)}...
                  {fesschainWalletAddress.slice(
                    fesschainWalletAddress.length - 12,
                    fesschainWalletAddress.length,
                  )}
                </Text>

                <TouchableOpacity onPress={() => handleFesschainAddressCopy()}>
                  <AntDesign name="copy1" size={22} color="#707070" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleExportPrivateKey()}>
                  <Entypo name="export" size={22} color="#707070" />
                </TouchableOpacity>

                <MaterialCommunityIcons
                  name="desktop-mac-dashboard"
                  size={22}
                  color="#707070"
                  onPress={handleFesschainExplorerLink}
                />
              </View>
            )}

            <View style={{ paddingVertical: 5, alignItems: 'center' }}>
              <Image source={fess} style={{ width: 45, height: 50 }} />
              <Text
                style={{
                  color: '#308dd4',
                  fontSize: 50,
                  fontWeight: '700',
                }}
              >
                {fesschainWalletBalance
                  ? (Number(fesschainWalletBalance) / 100000).toFixed(2)
                  : 0.0}
                {}{' '}
                <Text
                  style={{
                    color: '#308dd4',
                    fontSize: 25,
                    fontWeight: '500',
                  }}
                >
                  FESS
                </Text>
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('RenameWallet', {
                    type: 'fesschain',
                    address: fesschainWalletAddress,
                  })
                }
              >
                <FontAwesome name="edit" size={25} color="#707070" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  handleDeleteWallet({ address: fesschainWalletAddress })
                }
              >
                <MaterialCommunityIcons
                  name="delete-alert-outline"
                  size={25}
                  color="tomato"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('TransferFesschainWalletModal', {
                  fesschainWalletAddress,
                })
              }
            >
              <Image source={send} style={{ width: 70, height: 70 }} />
              <Text style={{ color: '#4e4e4e' }}>SEND</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('WalletQrCodeModal', {
                  address: fesschainWalletAddress,
                  name: fesschainWalletname,
                })
              }
            >
              <Image source={receive} style={{ width: 70, height: 70 }} />
              <Text style={{ color: '#4e4e4e' }}>RECEIVE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('Chat', {
                  address: fesschainWalletAddress,
                  name: fesschainWalletname,
                })
              }
            >
              <Image source={chat} style={{ width: 70, height: 70 }} />
              <Text style={{ color: '#4e4e4e' }}>CHAT</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', flex: 1 }}>
            <View
              style={{
                height: 45,
                backgroundColor: '#efefef',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
              }}
            >
              <Text style={styles.labelText}>Transaction History</Text>
            </View>

            {trxnHistoryLoading && (
              <View style={[{ paddingTop: 20 }, styles.containerColor]}>
                <ActivityIndicator size="small" color="#004c73" />
              </View>
            )}

            {!trxnHistoryLoading && trxnHistory.length === 0 && (
              <View style={{ padding: 15 }}>
                <Text style={{ textAlign: 'center' }}>
                  No Transaction Found
                </Text>
              </View>
            )}

            {!trxnHistoryLoading && trxnHistory.length > 0 && (
              <View style={{ flex: 0.9 }}>
                <FlatList
                  numColumns={1}
                  refreshing={true}
                  data={trxnHistory || []}
                  // data={[]}
                  keyExtractor={(item) => item}
                  renderItem={renderTrxn}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FesschainWalletInfoModal;
