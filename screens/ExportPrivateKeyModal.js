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

import Clipboard from 'expo-clipboard';

import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
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
  labelText: {
    fontSize: 25,
    fontWeight: '600',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  input: {
    // borderColor: '#ffd700',
    fontSize: 20,
    borderColor: '#308fd6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

const ExportPrivateKeyModal = ({ navigation, route }) => {
  const { privateKey } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <View>
          <Text style={styles.labelText}>Private Key</Text>
          <Text style={styles.input} selectable>
            {privateKey}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExportPrivateKeyModal;
