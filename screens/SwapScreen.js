import React from 'react';

import { SafeAreaView, StyleSheet, View, Text, Image } from 'react-native';

import comingSoon from '../images/coming-soon.png';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  safeArea: {
    flex: 1,
  },
  infoDiv: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 20,
  },
  textBlue: {
    color: '#4297d7',
    fontWeight: '600',
    paddingVertical: 10,
  },
  imgView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const SwapScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.containerColor]}>
        <View style={styles.infoDiv}>
          <Text style={[styles.textBlue, { fontSize: 18 }]}>
            We are just updating our app. This feature is coming soon. In the
            meantime, check out the other features!
          </Text>
        </View>
        <View style={styles.imgView}>
          <Image
            source={comingSoon}
            style={{ width: '90%', resizeMode: 'contain' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SwapScreen;
