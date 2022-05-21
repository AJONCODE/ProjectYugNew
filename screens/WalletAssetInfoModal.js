import {
  Alert,
  AppRegistry,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import React from 'react';
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
  const { tokenName, address, balance, symbol } = route.params;
  const [screenLoading, setScreenLoading] = React.useState(false);
  // Accepted values: ['ALL', 'SEND', 'RECEIVED']
  const [tokenProperty, setTokenProperty] = React.useState('ALL');
  const [historyAll, setHistoryAll] = React.useState([
    {
      trxnHash: 'ab12hgjk67ghtask6',
      date: Date.now(),
      type: 'send',
      amount: '8000',
    },
    {
      trxnHash: 'ab12hgjk67ghtask6',
      date: Date.now(),
      type: 'received',
      amount: '16000',
    },
  ]);
  const [historySend, setHistorySend] = React.useState([
    {
      trxnHash: 'ab12hgjk67ghtask6',
      date: Date.now(),
      type: 'send',
      amount: '8000',
    },
  ]);
  const [historyReceived, setHistoryReceived] = React.useState([
    {
      trxnHash: 'ab12hgjk67ghtask6',
      date: Date.now(),
      type: 'received',
      amount: '16000',
    },
  ]);
  const [selectedHistory, setSelectedHistory] = React.useState([...historyAll]);

  const selectAllProperty = () => {
    if (tokenProperty !== 'ALL') {
      setSelectedHistory(historyAll);
      setTokenProperty('ALL');
    }
  };

  const selectSendProperty = () => {
    if (tokenProperty !== 'SEND') {
      setSelectedHistory(historySend);
      setTokenProperty('SEND');
    }
  };

  const selectReceivedProperty = () => {
    if (tokenProperty !== 'RECEIVED') {
      setSelectedHistory(historyReceived);
      setTokenProperty('RECEIVED');
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: `${tokenName} Stats`,
    });
  }, []);

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
                fontSize: 25,
                color: '#707070',
                textAlign: 'center',
              }}
            >
              {tokenName} ({symbol})
            </Text>
            <Text
              style={{
                fontSize: 25,
                color: '#707070',
                textAlign: 'center',
              }}
            >
              Available Balance
            </Text>
            <Text
              style={{
                fontSize: 40,
                color: '#308dd4',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {balance}
            </Text>
          </View>

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
          </View>

          {selectedHistory.length > 0 &&
            selectedHistory.map((trxn) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e5e5',
                }}
              >
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 20 }}>{trxn.trxnHash}</Text>
                  <Text style={{ fontSize: 15, color: '#cecece' }}>
                    {new Date(trxn.date).toLocaleString()}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      trxn.type === 'send' && styles.sendTrxn,
                      trxn.type === 'received' && styles.receivedTrxn,
                      { fontSize: 28 },
                    ]}
                  >
                    {trxn.type === 'send' && '+'}
                    {trxn.type === 'received' && '-'}
                    {trxn.amount}
                  </Text>
                </View>
              </View>
            ))}

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
