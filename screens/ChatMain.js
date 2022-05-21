import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';

import logo from '../images/logo.png';
import { baseURL } from '../utils/fesschain';

const BaseUrl = `${baseURL.fesspay_server}`;
const SocketBaseUrl = `${baseURL.socket_fesspay}`;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  containerLoading: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: '#00BFFF',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 275,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  item: {
    marginVertical: 8,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderRadius: 300,
    padding: 3,
  },
});

const ChatMain = ({ navigation, route }) => {
  const { address, name } = route.params;
  const scrollViewRef = React.useRef(null);

  // chatProfileAddress: the new address of the wallet we want to chat with
  const [screenLoading, setScreenLoading] = React.useState(false);
  const [chatProfileAddress, setChatProfileAddress] = React.useState('');
  // available chat profiles for a wallet address
  const [chatProfileList, setChatProfileList] = React.useState([]);
  const [uniqueChatKeysUnread, setUniqueChatKeysUnread] = React.useState([]);
  const [to, setTo] = React.useState('');
  const [messages, setMessages] = React.useState(null);
  const [socket, setSocket] = React.useState(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }, 50);
    }
  };

  const handleChatProfileListUnreadMessageCount = async (profileListArr) => {
    try {
      const uniqueChatKeyArrBodyData = {
        uniqueChatKeyArr: profileListArr,
      };

      const result = await axios.post(
        `${BaseUrl}chat/chat-address-unread/${address}`,
        uniqueChatKeyArrBodyData,
      );

      setUniqueChatKeysUnread(result.data.data.uniqueChatKeysUnread);
    } catch (err) {
      console.log('handleChatProfileList: error: err: ', err);
    }
  };

  const fetchUnreadMsgCountFrom = (from) => {
    const fromObjArr = uniqueChatKeysUnread.filter(
      (resultObj) => resultObj.from === from,
    );

    // console.log('fromObjArr: ', fromObjArr);

    if (fromObjArr.length > 0) {
      return fromObjArr[0].unreadMsgCount || 0;
    } else {
      return 0;
    }
  };

  const handleChatProfileList = async () => {
    try {
      // await AsyncStorage.removeItem('chatProfileObj');
      setScreenLoading(true);
      const result = await axios.get(`${BaseUrl}chat/${address}`);
      console.info('result');

      const chatKeyArr = result.data.data.chatKeyArr;
      handleChatProfileListUnreadMessageCount(chatKeyArr);

      let chatProfileObj =
        JSON.parse(await AsyncStorage.getItem('chatProfileObj')) || {};

      let addressChatProfiesArray = chatProfileObj[address] || [];

      if (chatKeyArr.length) {
        chatKeyArr.map(async (chatKey, index) => {
          const receiver = chatKey.split(address);
          if (
            !!receiver[0].trim() &&
            !addressChatProfiesArray.includes(receiver[0].trim())
          ) {
            // console.info('receiver[0]: ', receiver[0]);
            addressChatProfiesArray.push(receiver[0].trim());
          } else if (
            !!receiver[1].trim() &&
            !addressChatProfiesArray.includes(receiver[1].trim())
          ) {
            // console.info('receiver[1]: ', receiver[1]);
            addressChatProfiesArray.push(receiver[1].trim());
          }

          if (index === chatKeyArr.length - 1) {
            setChatProfileList(addressChatProfiesArray);
          }
        });
        setScreenLoading(false);
      } else {
        setChatProfileList(addressChatProfiesArray);
        setScreenLoading(false);
      }
    } catch (err) {
      console.log('handleChatProfileList: error: err: ', err);
      setScreenLoading(false);
    }
  };

  const handleAddChatProfile = async () => {
    let chatProfileObj =
      JSON.parse(await AsyncStorage.getItem('chatProfileObj')) || {};

    let addressChatProfiesArray = chatProfileObj[address] || [];
    const walletAddressArray = Object.keys(chatProfileObj);
    if (addressChatProfiesArray.includes(chatProfileAddress.trim())) {
      Alert.alert('Address Already added!');
    } else if (chatProfileAddress.trim() === address) {
      Alert.alert('Cannot add own address!');
    } else if (walletAddressArray.includes(chatProfileAddress.trim())) {
      Alert.alert('Cannot add own address!');
    } else {
      addressChatProfiesArray.unshift(chatProfileAddress.trim());

      chatProfileObj[address] = addressChatProfiesArray;

      console.info('chatProfileObj: ', chatProfileObj);

      await AsyncStorage.setItem(
        'chatProfileObj',
        JSON.stringify(chatProfileObj),
      );

      setChatProfileAddress('');
      setTo(chatProfileAddress.trim());
      navigateToChatConversation(chatProfileAddress);
      // await handleChatProfileList();
    }
  };

  const navigateToChatConversation = (toAddress) => {
    setTo(toAddress);
    navigation.navigate('ChatConversation', {
      myAddress: address,
      otherAddress: toAddress,
      messages,
      socket,
    });
  };

  const fetchChatSocket = async (otherAddress) => {
    try {
      console.info('otherAddress: ', otherAddress);
      const addressArr = [address, otherAddress];
      addressArr.sort();

      const chatUniqueString = `${addressArr[0]} ${addressArr[1]}`;

      const result = await axios.get(
        `${BaseUrl}chat?uniqueChatKey=${chatUniqueString}&page=1&limit=10000`,
      );

      setMessages(result.data.result.results);
    } catch (err) {
      console.log('err: ', err);
    }
  };

  React.useEffect(() => {
    (async () => {
      const socket = io(SocketBaseUrl);
      // const socket = io('https://api.fesspay.com');
      socket.connect();
      setSocket(socket);
      socket.on('disconnect', () => {
        console.log('connection to server lost.');
      });
      socket.on('chatUniqueStringEmitBE', async (emitMsg) => {
        // console.log('socket: chatUniqueStringEmitBE: ', emitMsg);
        // console.log('to: ', to);

        // chat profile list is open
        if (to) {
          if (emitMsg.to === address) {
            await handleChatProfileList();
            await fetchChatSocket(emitMsg.from);
          }
        }
      });
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // console.log('every time user go to chat: fetching profile list');
      handleChatProfileList();
    }, []),
  );

  React.useEffect(() => {
    navigation.setOptions({
      title: `${name} Chat`,
    });
  }, []);

  // React.useEffect(scrollToBottom, [chatProfileList]);

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.select({ ios: 75, android: 500 })}
      style={styles.safeArea}
      // resetScrollToCoords={{ x: 0, y: 0 }}
      // contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
          {screenLoading && (
            <View style={[styles.containerLoading]}>
              <ActivityIndicator size="small" color="#004c73" />
            </View>
          )}

          {!screenLoading && (
            <View style={styles.container}>
              <View style={{ flex: 1 }}>
                <FlatList
                  style={styles.list}
                  data={chatProfileList}
                  ref={scrollViewRef}
                  onContentSizeChange={() => scrollToBottom()}
                  keyExtractor={(item) => {
                    return item;
                  }}
                  renderItem={(profile) => {
                    const item = profile.item;
                    return (
                      item !== address && (
                        <TouchableOpacity
                          onPress={() => navigateToChatConversation(item)}
                        >
                          <View style={[styles.item]}>
                            <View style={[styles.balloon]}>
                              <Text
                                style={{
                                  top: 5,
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                            <Image source={logo} style={styles.iconSend} />
                            {fetchUnreadMsgCountFrom(item) > 0 && (
                              <Text
                                style={{
                                  color: 'red',
                                  fontSize: 10,
                                  right: 90,
                                  bottom: 1,
                                }}
                              >
                                {fetchUnreadMsgCountFrom(item)} UNREAD MESSAGE
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      )
                    );
                  }}
                />
              </View>
            </View>
          )}
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Add Chat Profile ..."
                underlineColorAndroid="transparent"
                value={chatProfileAddress}
                onChangeText={setChatProfileAddress}
                onSubmitEditing={chatProfileAddress && handleAddChatProfile}
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatMain;
