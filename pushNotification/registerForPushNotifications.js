import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

import { baseURL } from '../utils/fesschain';

// const PUSH_ENDPOINT = `${baseURL.fesspay_server}chat/token`;
const PUSH_ENDPOINT = `${baseURL.fesspay_server}notification`;

const registerForPushNotifications = async () => {
  try {
    if (Constants.isDevice) {
      // const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }

      console.log(`🦅 finalStatus: ${finalStatus}`);

      const token = await Notifications.getExpoPushTokenAsync();

      console.log(`🦅 push notification token: ${JSON.stringify(token)}`);

      await AsyncStorage.setItem('notificationToken', JSON.stringify(token));

      await axios.post(`${PUSH_ENDPOINT}`, {
        notificationToken: token,
      });

      // POST the token to your backend server from where you can retrieve it to send push notifications.
      // return fetch(PUSH_ENDPOINT, {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     token: {
      //       value: token,
      //     },
      //   }),
      // });

      // return fetch(PUSH_ENDPOINT, {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: {
      //     notificationToken: token,
      //   },
      // });
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (err) {
    console.error('registerForPushNotifications: err: ', err);
    console.warn('registerForPushNotifications: err: ', err.response.data);
  }
};
export default registerForPushNotifications;
