import {
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from 'expo-clipboard';
import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';

import logo from '../images/logo.png';
import { baseURL } from '../utils/fesschain';

const BaseUrl = `${baseURL.fesspay_server}`;

const { width, height } = Dimensions.get('window');

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
  messagesContainer: {
    flex: 1,
    height: height - 200,
    paddingHorizontal: 10,
  },
  list: {
    paddingHorizontal: 17,
  },
  balloonOut: {
    flexDirection: 'row',
  },
  balloonIn: {
    flexDirection: 'row-reverse',
  },
  balloonImg: {
    width: 11,
    height: 22,
    marginHorizontal: 5,
  },
  balloon: {
    maxWidth: 275,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(225, 225, 225, 0.7)',
  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(11, 147, 246, 0.5)',
  },
  time: {
    alignSelf: 'flex-end',
    margin: 10,
    fontSize: 10,
    color: '#808080',
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
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  item: {
    marginVertical: 8,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderRadius: 300,
    padding: 3,
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
});

const ChatConversation = ({ navigation, route }) => {
  const { myAddress, otherAddress, messages, socket } = route.params;
  const scrollViewRef = React.useRef(null);

  const [chatMessages, setChatMessages] = React.useState([]);
  const [formValue, setFormValue] = React.useState('');
  const [selectedMessage, setSelectedMessage] = React.useState(null);

  const handleCopyMessage = () => {
    // copy to clipboard
    Clipboard.setString(selectedMessage);

    // alert
    // Alert.alert('Message copied successfully');

    setSelectedMessage(null);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const fetchChat = async () => {
    try {
      const addressArr = [myAddress, otherAddress];
      addressArr.sort();

      const chatUniqueString = `${addressArr[0]} ${addressArr[1]}`;

      // console.log('chatUniqueString: ', chatUniqueString);

      const result = await axios.get(
        `${BaseUrl}chat?uniqueChatKey=${chatUniqueString}&page=1&limit=10000`,
      );

      // console.log('fetchChat: result.data: ', result.data);

      setChatMessages(result.data.result.results);
    } catch (err) {
      console.log('err: ', err);
    }
  };

  const sendMessage = async (e) => {
    if (!formValue) {
      console.log('empty');
    } else {
      try {
        // e.preventDefault();

        const addressArr = [myAddress, otherAddress];
        addressArr.sort();

        // console.log('addressArr: ', addressArr);

        const chatUniqueString = `${addressArr[0]} ${addressArr[1]}`;

        // console.log('send message: chatUniqueString: ', chatUniqueString);

        const fromAddress = myAddress;

        const messageBodyData = {
          text: formValue,
          to: otherAddress,
          from: fromAddress,
          uniqueChatKey: chatUniqueString,
        };

        // console.log('messageBodyData: ', messageBodyData);

        const result = await axios.post(`${BaseUrl}chat`, messageBodyData);

        // console.log('sendMessage: result: ', result);

        setFormValue('');
        fetchChat();

        socket.emit('chatUniqueString', {
          chatUniqueString,
          to: otherAddress,
          from: fromAddress,
        });
      } catch (err) {
        console.log('sendMessage catch err: ', err);
        console.log('sendMessage catch err.response : ', err.response);
      }
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }, 50);
    }
  };

  const handleSelectedProfileReadAll = async (profileAddress) => {
    const addressArr = [myAddress, profileAddress];
    addressArr.sort();

    const uniqueChatKey = `${addressArr[0]} ${addressArr[1]}`;

    await axios.put(`${BaseUrl}chat/update?address=${profileAddress}`, {
      uniqueChatKey: uniqueChatKey,
    });

    // console.log('handleSelectedProfileReadAll: ', result.data.data.updateChat);
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: `${otherAddress.slice(0, 7)}...${otherAddress.slice(
        otherAddress.length - 15,
        otherAddress.length,
      )}`,
    });
    setChatMessages(messages);
    fetchChat();
    handleSelectedProfileReadAll(otherAddress);
  }, []);

  React.useEffect(() => {
    setChatMessages(messages);
  }, []);

  React.useEffect(() => {
    (async () => {
      socket.on('chatUniqueStringEmitBE', async (emitMsg) => {
        // console.log('socket: chatUniqueStringEmitBE: ', emitMsg);
        if (emitMsg.to === myAddress) {
          await fetchChat();
        }
      });
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.select({ ios: 55, android: 500 })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {!!selectedMessage && (
              <View
                style={[
                  styles.messagesContainer,
                  {
                    backgroundColor: '#308fd6',
                  },
                ]}
              >
                <TouchableOpacity onPress={() => handleCopyMessage()}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      padding: 8,
                      textAlign: 'right',
                    }}
                  >
                    <AntDesign name="copy1" size={20} color="#01102e" />
                    COPY MESSAGE
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              style={styles.list}
              data={chatMessages || []}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollToBottom()}
              keyExtractor={(item) => {
                return item.id;
              }}
              renderItem={(message) => {
                const item = message.item;
                let itemStyle =
                  item.from === otherAddress ? styles.itemIn : styles.itemOut;
                let balloonRowStyle =
                  item.from === otherAddress
                    ? styles.balloonIn
                    : styles.balloonOut;
                return (
                  <TouchableOpacity
                    onLongPress={() => handleSelectMessage(item.text)}
                  >
                    <View style={[styles.item, itemStyle]}>
                      <View style={[styles.balloon, balloonRowStyle]}>
                        <Text>{item.text}</Text>
                        {/* <Image source={logo} style={styles.balloonImg} /> */}
                      </View>
                      <Text style={styles.time}>
                        <Image source={logo} style={styles.balloonImg} />
                        {`\n${new Date(item.createdAt).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Enter Message..."
                underlineColorAndroid="transparent"
                value={formValue}
                onChangeText={setFormValue}
                onSubmitEditing={sendMessage}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatConversation;
