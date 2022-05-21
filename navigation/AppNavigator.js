import * as React from 'react';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Header } from 'react-navigation-stack';

import Constants from 'expo-constants';

import { Platform, StyleSheet, View } from 'react-native';

import AddTokenModal from '../screens/AddTokenModal';
import AuthPincodeModal from '../screens/AuthPincodeModal';
import ChatMain from '../screens/ChatMain';
import ChatConversation from '../screens/ChatConversation';
import Home from '../screens/Home';
import ImportWalletNameModal from '../screens/ImportWalletNameModal';
import ImportWalletModal from '../screens/ImportWalletModal';
import CreateWallet from '../screens/CreateWallet';
import CreateWalletMnemonic from '../screens/CreateWalletMnemonic';
import CreateWalletMnemonicConfirm from '../screens/CreateWalletMnemonicConfirm';
import CreateWalletModalInWalletScreen from '../screens/CreateWalletModalInWalletScreen';
import CreateFesschainWalletScreen from '../screens/CreateFesschainWalletScreen';
import FesschainImportWalletNameModal from '../screens/FesschainImportWalletNameModal';
import FesschainImportWalletModal from '../screens/FesschainImportWalletModal';
import RenameWallet from '../screens/RenameWallet';
import ExportPrivateKeyModal from '../screens/ExportPrivateKeyModal';
import WalletQrCodeModal from '../screens/WalletQrCodeModal';
import TokenQrCodeModal from '../screens/TokenQrCodeModal';
import TokenTransferModal from '../screens/TokenTransferModal';
import TransferFesschainWalletModal from '../screens/TransferFesschainWalletModal';
import TransferSelectiveTokenModal from '../screens/TransferSelectiveTokenModal';
// import SetWalletPassword from '../screens/SetWalletPassword';
import LockScreen from '../screens/LockScreen';
import { NavigationContainer } from '@react-navigation/native';
import OurProductsModal from '../screens/OurProductsModal';
import PrivacyPolicyModal from '../screens/PrivacyPolicyModal';
import Setting from '../screens/Setting';
import SwapScreen from '../screens/SwapScreen';
import TransferWalletModal from '../screens/TransferWalletModal';
import Wallet from '../screens/Wallet';
import WalletInfoModal from '../screens/WalletInfoModal';
import FesschainWalletInfoModal from '../screens/FesschainWalletInfoModal';
import WalletAssetInfoModal from '../screens/WalletAssetInfoModal';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// function getHeaderTitle(route) {
//   // console.error('route: ', route);
//   // console.error('route: ', route.name);
//   const routeName = route.state
//     ? route.state.routes[route.state.index].name
//     : route.params?.screen || 'Home';

//   switch (routeName) {
//     case 'Home':
//       return 'Home';
//     case 'Wallet':
//       return 'Wallet';
//     case 'Transfer':
//       return 'Transfer';
//     case 'Chat':
//       return 'Chat';
//   }
// }

const GradientHeader = (props) => {
  // console.log('gradient Header: props: ', props);
  return (
    <View>
      <LinearGradient
        colors={['#004c73', '#26a0da']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: 75 }]}
      >
        <Header {...props} />
      </LinearGradient>
    </View>
  );
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Wallet') {
            iconName = 'wallet-plus';
          } else if (route.name === 'Swap') {
            iconName = 'swap-horizontal';
            size = 35;
          } else if (route.name === 'Setting') {
            iconName = 'settings';
          }

          return route.name === 'Setting' ? (
            <Feather name={iconName} color={color} size={size} />
          ) : (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
        navigationOptions: {
          header: null,
        },
        tabBarLabel: route.name,
      })}
      tabBarOptions={{
        labelPosition: 'below-icon',
        // activeTintColor: Platform.OS === 'ios' ? '#7c53c3' : '#fff',
        activeTintColor: '#fff',
        inactiveTintColor: '#a6a6a6',
        style: {
          minHeight: Constants.statusBarHeight,
          // backgroundColor: Platform.OS === 'ios' ? '#fff' : '#7c53c3',
          backgroundColor: '#0b5d8a',
          shadowColor: 'rgba(0, 0, 0, 0.24)',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 6,
          shadowOpacity: 1,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarVisible: false,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="LockScreen"
        component={LockScreen}
        options={{
          tabBarVisible: false,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Swap" component={SwapScreen} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: true,
        headerStyle: {
          // backgroundColor: '#101010',
          backgroundColor: '#01102e',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // headerTintColor: '#ffd700',
        headerTintColor: '#308fd6',
        headerBackTitleVisible: false,
      }}
      headerMode="float"
    >
      {/* <MainStack.Screen
        name="Home"
        component={MainTabNavigator}
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
        })}
      /> */}

      <MainStack.Screen
        name="Home"
        component={MainTabNavigator}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="Wallet"
        component={Wallet}
        options={{ title: 'Wallet' }}
      />
      <MainStack.Screen
        name="Swap"
        component={SwapScreen}
        options={{ title: 'Swap' }}
      />
      <MainStack.Screen
        name="Setting"
        component={Setting}
        options={{ title: 'Setting' }}
      />
      <MainStack.Screen name="LockScreen" component={LockScreen} />
    </MainStack.Navigator>
  );
}

function RootStackNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="BACK"
          component={MainStackNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="CreateWallet"
          component={CreateWallet}
          options={{
            headerShown: true,
            headerTitle: 'Create Wallet (Step 1)',
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="CreateWalletMnemonic"
          component={CreateWalletMnemonic}
          options={{
            headerShown: true,
            headerTitle: 'Create Wallet (Step 2)',
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="CreateWalletMnemonicConfirm"
          component={CreateWalletMnemonicConfirm}
          options={{
            headerShown: true,
            headerTitle: 'Create Wallet (Step 3)',
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {/* <RootStack.Screen
          name="SetWalletPassword"
          component={SetWalletPassword}
          options={{
            headerShown: true,
            headerTitle: 'Create Wallet (Step 2)',
            header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              // fontWeight: 'bold',
            },
          }}
          navigationOptions={{ headerTintColor: '#f6433d' }}
        /> */}
        {/* <RootStack.Screen
          name="Confirm Password (Step 3/3)"
          component={ConfirmPassword}
        /> */}

        <RootStack.Screen
          name="ImportWalletNameModal"
          component={ImportWalletNameModal}
          options={{
            headerShown: true,
            headerTitle: 'Import Wallet (Step 1)',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <RootStack.Screen
          name="ImportWalletModal"
          component={ImportWalletModal}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <RootStack.Screen
          name="Wallet-Stats"
          component={WalletInfoModal}
          options={{
            headerShown: true,
            // headerTitle: 'Wallet Stats',
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="WalletAssetInfoModal"
          component={WalletAssetInfoModal}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <RootStack.Screen
          name="ExportPrivateKeyModal"
          component={ExportPrivateKeyModal}
          options={{
            headerShown: true,
            headerTitle: 'Private Key',
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="RenameWallet"
          component={RenameWallet}
          options={{
            headerShown: true,
            headerTitle: 'Rename Wallet',
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="TokenTransferModal"
          component={TokenTransferModal}
          options={{
            headerShown: true,
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="TransferSelectiveTokenModal"
          component={TransferSelectiveTokenModal}
          options={{
            headerShown: true,
            headerTitle: 'Transfer Token',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="WalletQrCodeModal"
          component={WalletQrCodeModal}
          options={{
            headerShown: true,
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="TokenQrCodeModal"
          component={TokenQrCodeModal}
          options={{
            headerShown: true,
            // header: (props) => <GradientHeader {...props} />,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="AddTokenModal"
          component={AddTokenModal}
          options={{
            headerShown: true,
            headerTitle: 'Add Token',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="Chat"
          component={ChatMain}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="ChatConversation"
          component={ChatConversation}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="Authentication"
          component={AuthPincodeModal}
          options={{
            headerShown: true,
            headerTitle: 'Yug Network Authentication',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="Privacy-Policy"
          component={PrivacyPolicyModal}
          options={{
            headerShown: true,
            headerTitle: 'Yug Network Privacy Policy',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="CreateWalletModalInWalletScreen"
          component={CreateWalletModalInWalletScreen}
          options={{
            headerShown: true,
            headerTitle: 'Create Wallet',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="CreateFesschainWalletScreen"
          component={CreateFesschainWalletScreen}
          options={{
            headerShown: true,
            headerTitle: 'Create Yug Wallet',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="FesschainImportWalletNameModal"
          component={FesschainImportWalletNameModal}
          options={{
            headerShown: true,
            headerTitle: 'Import Yug Wallet (Step 1)',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="FesschainImportWalletModal"
          component={FesschainImportWalletModal}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="FesschainWalletInfoModal"
          component={FesschainWalletInfoModal}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen
          name="TransferFesschainWalletModal"
          component={TransferFesschainWalletModal}
          options={{
            headerShown: true,
            headerTitle: 'Yug Transfer',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#1172a1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <RootStack.Screen name="Our-Products" component={OurProductsModal} />
        <RootStack.Screen
          name="Transfer-Ether"
          component={TransferWalletModal}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default RootStackNavigator;
