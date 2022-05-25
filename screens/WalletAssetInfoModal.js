import {
  Alert,
  AppRegistry,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import sendIcon from '../images/wallet/send.png';
// import AppButton from '../components/AppButton';

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
    alignItems: 'center',
    paddingTop: 20,
  },
  safeArea: {
    flex: 1,
  },
  activeButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#156ca1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  activeButtonText: {
    color: '#edf4f8',
    fontWeight: '600',
  },
  inactiveButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#efefef',

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  inactiveButtonText: {
    fontWeight: '600',
    color: '#8f8f8f',
  },
  sendTrxn: {
    fontWeight: '700',
    color: '#00b800',
  },
  receivedTrxn: {
    fontWeight: '700',
    color: '#ff7c7c',
  },
});

const WalletAssetInfoModal = ({ navigation, route }) => {
  const { tokenName, address, balance, symbol, walletAddress } = route.params;
  const [screenLoading, setScreenLoading] = React.useState(true);
  const [transactionHistory, setTransactionHistory] = React.useState({});


  const getHistory = async () => {
    //await AsyncStorage.removeItem('transactions');

    setScreenLoading(true);

    let transacData = await AsyncStorage.getItem('transactions');
    transacData = JSON.parse(transacData);

    if (transacData !== null) {

      let walletTrxData = transacData[walletAddress];
      let tokenTrxData = walletTrxData[address];

      console.info('trxdata: ', tokenTrxData);
      console.log('trx keys', Object.values(transactionHistory))
      Object.values(transactionHistory).forEach((trxn) => {
        console.log(trxn.date)
      })

      setTransactionHistory(transactionHistory => ({
        ...transactionHistory,
        ...tokenTrxData
      }));
    }

    setScreenLoading(false);

  }

  React.useEffect(() => {
    getHistory();
    navigation.setOptions({
      title: `${tokenName} Stats`,
    });
  }, []);



  // Accepted values: ['ALL', 'SEND', 'RECEIVED']
  //const [tokenProperty, setTokenProperty] = React.useState('ALL');

  // const [historySend, setHistorySend] = React.useState([
  //   {
  //     trxnHash: 'ab12hgjk67ghtask6',
  //     date: Date.now(),
  //     type: 'send',
  //     amount: '8000',
  //   },
  // ]);
  // const [historyReceived, setHistoryReceived] = React.useState([
  //   {
  //     trxnHash: 'ab12hgjk67ghtask6',
  //     date: Date.now(),
  //     type: 'received',
  //     amount: '16000',
  //   },
  // ]);
  // const [selectedHistory, setSelectedHistory] = React.useState([...historyAll]);

  // const selectAllProperty = () => {
  //   if (tokenProperty !== 'ALL') {
  //     setSelectedHistory(historyAll);
  //     setTokenProperty('ALL');
  //   }
  // };

  // const selectSendProperty = () => {
  //   if (tokenProperty !== 'SEND') {
  //     setSelectedHistory(historySend);
  //     setTokenProperty('SEND');
  //   }
  // };

  // const selectReceivedProperty = () => {
  //   if (tokenProperty !== 'RECEIVED') {
  //     setSelectedHistory(historyReceived);
  //     setTokenProperty('RECEIVED');
  //   }
  // };



  return (
    <SafeAreaView style={styles.safeArea}>
      {screenLoading && (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="small" color="#004c73" />
        </View>
      )}

      {!screenLoading && (
        <View style={styles.container}>
          <View style={{ marginBottom: 30 }}>

            <Text
              style={{
                fontSize: 15,
                color: '#707070',
                textAlign: 'center',
              }}
            >
              Available Balance
            </Text>
            <Text
              style={{
                fontSize: 30,
                color: '#308dd4',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {balance} {symbol}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: 50,
              backgroundColor: '#efefef',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 20
            }}
          >
            <View
              style={{
                width: '50%',
                alignItems: 'flex-start'
              }}
            >
              <Text style={{ fontSize: 20 }}>Transaction</Text>
            </View>
            <View
              style={{
                width: '50%',
                alignItems: 'flex-end',
                fontSize: 30,
              }}
            >
              <Text style={{ fontSize: 20 }}>Amount</Text>
            </View>
          </View>

          {Object.keys(transactionHistory).length === 0 && (
            <Text style={{ fontSize: 15 }}>No Transactions yet.</Text>
          )
          }

          {Object.keys(transactionHistory).length !== 0 &&
            Object.values(transactionHistory).map((trxn) => (
              <View
                key={trxn.trxnHash}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingBottom:5,
                  marginBottom: 25,
                  borderBottomWidth : 1,
                  borderBottomColor : 'grey',
                  borderStyle : 'dashed'
                }}
              >
                <View
                  style={{
                    width: '60%',
                    alignItems: 'flex-start',
                  }}
                >


                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 5 
                    }}
                  >
                    <Image source={sendIcon} style={{ width: 30, height: 30 , marginRight: 8}} />
                    <Text style={{ fontSize: 20}}>Send {symbol}</Text>

                  </View>


                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Text style={{ marginRight: 15 }}>{new Date(trxn.date).toLocaleDateString()}</Text>
                    <Text style={{ marginRight: 2, fontWeight: 'bold' }}>To : </Text>
                    <Text>
                      {(trxn.to).slice(0, 6)}......
                      {(trxn.to).slice((trxn.to).length - 6, (trxn.to).length)}
                    </Text>
                  </View>

                </View>
                <View
                  style={{
                    width: '40%',
                    alignItems: 'flex-end',
                  }}
                >
                  <Text style={{ fontSize: 20, color: '#308dd4' }}>
                    {trxn.amount} {symbol}
                  </Text>
                </View>
              </View>
            ))
          }

          {/* 
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
              style={[
                tokenProperty === 'ALL'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() => selectAllProperty()}
            >
              <Text
                style={[
                  tokenProperty === 'ALL'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                  { fontSize: 20 },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tokenProperty === 'SEND'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() => selectSendProperty()}
            >
              <Text
                style={[
                  tokenProperty === 'SEND'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                  { fontSize: 20 },
                ]}
              >
                Send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tokenProperty === 'RECEIVED'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() => selectReceivedProperty()}
            >
              <Text
                style={[
                  tokenProperty === 'RECEIVED'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                  { fontSize: 20 },
                ]}
              >
                Received
              </Text>
            </TouchableOpacity>
          </View> */}


          

          {/* <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'flex-end', 
              //   justifyContent: 'flex-end',
            }}
          >
            <View style={{ flex: 1, padding: 10 }}>
              <AppButton
                // buttonType="DUAL"
                title="SEND"
                // backgroundColor="#008080"
                backgroundColor="#01102e"
                isDisabled={false}
                handlePress={() =>
                  navigation.navigate('TokenTransferModal', {
                    address,
                    tokenName,
                  })
                }
              />
            </View>
            <View style={{ width: '80%', flex: 1, padding: 10 }}>
              <AppButton
                style={{ width: '80%' }}
                title="RECEIVED"
                isDisabled={false}
                handlePress={() =>
                  navigation.navigate('TokenQrCodeModal', {
                    address,
                    tokenName,
                  })
                }
              />
            </View>
          </View> */}
        </View>
      )}
    </SafeAreaView>
  );
};

export default WalletAssetInfoModal;
