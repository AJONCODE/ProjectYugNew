import { Image, SafeAreaView, StyleSheet, View } from 'react-native';

import { SliderBox } from 'react-native-image-slider-box';

import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import main from '../images/main.png';
import { useFocusEffect } from '@react-navigation/native';

import registerForPushNotifications from '../pushNotification/registerForPushNotifications';

import home1 from '../images/home/home1.png';
import home2 from '../images/home/home2.png';
import home3 from '../images/home/home3.png';
import home4 from '../images/home/home4.png';

const sliderImages = [home1, home2, home3, home4];

const Home = ({ navigation }) => {
  // const walletContextValue = React.useContext(WalletContext);
  // const [createWalletLoading, setCreateWalletLoading] = React.useState(false);

  // const resetWallet = React.useCallback(async () => {
  //   try {
  //     await AsyncStorage.removeItem('wallets');
  //     await AsyncStorage.removeItem('fesschainWallets');
  //     await AsyncStorage.removeItem('tokenArrObj');
  //     await AsyncStorage.removeItem('chatProfileObj');
  //     await AsyncStorage.removeItem('activePincode');
  //   } catch (err) {
  //     console.warn('RESET WALLET: err: ', err);
  //   }
  // }, []);

  const handleCreateWalletScreen = () => {
    navigation.navigate('CreateWallet');
  };

  const handleImportWalletModal = () => {
    navigation.navigate('ImportWalletNameModal');
  };

  const redirectToWallet = React.useCallback(async () => {
    const wallets = await AsyncStorage.getItem('wallets');
    if (wallets) {
      await navigation.navigate('Wallet');
    }
  }, []);

  React.useEffect(() => {
    redirectToWallet();
  }, []);

  const renderToLock = async () => {
    const activePincode = await AsyncStorage.getItem('activePincode');
    console.log('renderToLock: activePincode: ', activePincode);
    if (activePincode) {
      navigation.navigate('LockScreen');
    } else if (await AsyncStorage.getItem('wallets')) {
      await navigation.navigate('Wallet');
    } else {
      await navigation.navigate('Home');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      async function refreshOnScreenFocus() {
        await renderToLock();
      }
      refreshOnScreenFocus();
    }, []),
  );

  // reset wallet
  // React.useEffect(() => {
  //   resetWallet();
  // }, []);

  return (
    <SafeAreaView style={[styles.safeArea, styles.containerBackground]}>
      <Image source={main} style={styles.mainImg} />
      <View style={[styles.container]}>
        <View style={styles.sliderImage}>
          <SliderBox
            images={sliderImages}
            // sliderBoxHeight={'100%'}
            dotColor="#FFEE58"
            inactiveDotColor="#90A4AE"
            dotStyle={{
              width: 15,
              height: 15,
              borderRadius: 15,
              marginHorizontal: 10,
              top: 20,
              padding: 0,
              // marginTop: 50,
            }}
            paginationBoxVerticalPadding={10}
            autoplay
            circleLoop
            resizeMethod={'resize'}
            resizeMode={'contain'}
            ImageComponentStyle={{
              borderRadius: 15,
              width: '65%',
            }}
            imageLoadingColor="#2196F3"
          />
        </View>
        <View
          style={{ display: 'flex', flexDirection: 'row', marginTop: 'auto' }}
        >
          <View style={{ flex: 1, padding: 5 }}>
            <AppButton
              title="Create Wallet"
              backgroundColor="#01102e"
              isDisabled={false}
              handlePress={handleCreateWalletScreen}
            />
          </View>
          <View style={{ flex: 1, padding: 5 }}>
            <AppButton
              title="Import an Existing Wallet"
              backgroundColor="#01102e"
              isDisabled={false}
              handlePress={handleImportWalletModal}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImg: {
    width: '100%',
    resizeMode: 'stretch',
  },
  safeArea: {
    flex: 1,
    margin: 0,
  },
  sliderImage: {
    marginTop: 'auto',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderImageDesc: {
    marginBottom: 35,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default Home;
