import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import '@ethersproject/shims';
// import * as Font from 'expo-font';

import Constants from 'expo-constants';
import { ActivityIndicator, StatusBar } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import RootStackNavigator from './navigation/AppNavigator';
import { View } from 'react-native';
import { WalletProvider } from './contexts/wallet-context';
import registerForPushNotifications from './pushNotification/registerForPushNotifications';

function AppStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

export default function App() {
  const [walletContextValue, setWalletContextValue] = React.useState({
    wallet: null,
    privateKey: null,
    address: null,
    walletCreated: false,
    walletImported: false,
    walletBalance: null,
  });

  const [assetsLoaded, setAssetsLoaded] = React.useState(false);

  const loadAssetsAsync = async () => {
    // await Font.loadAsync(customFonts);
    setAssetsLoaded(true);
  };

  React.useEffect(() => {
    loadAssetsAsync();

    registerForPushNotifications();
  }, []);

  // const initLocalStorageAndContext = React.useCallback(async () => {
  //   // add wallet info from localStorage
  //   const wallets = await AsyncStorage.getItem('wallets');
  //   setWalletContextValue({
  //     ...walletContextValue,
  //     wallets: wallets,
  //   });
  // }, []);

  // React.useEffect(() => {}, []);

  if (assetsLoaded) {
    return (
      <WalletProvider value={walletContextValue}>
        {/* #7c53c3 => light purple */}
        <AppStatusBar backgroundColor={'#0b5d8a'} barStyle="light-content" />
        <RootStackNavigator />
      </WalletProvider>
    );
  } else {
    return (
      <View>
        <ActivityIndicator size="small" color="#004c73" />
      </View>
    );
  }
}
