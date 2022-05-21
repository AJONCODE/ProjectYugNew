import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Loading from './Loading';
import React from 'react';
import styled from 'styled-components';

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

const ButtonText = styled.Text`
  font-size: 15px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  text-transform: uppercase;
  text-align: center;
`;

const styles = StyleSheet.create({
  appButtonDisabled: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },
  button: {
    elevation: 8,
    // marginTop: 50,
    marginBottom: 30,
    borderRadius: 5,
    minHeight: 60,
    minWidth: 150,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

const AppButton = ({
  onPress,
  title,
  size,
  titleSize,
  backgroundColor,
  buttonType,
  isDisabled,
  handlePress,
  loadingText,
  loading = false,
}) => (
  <TouchableOpacity
    disabled={isDisabled}
    onPress={handlePress}
    style={[
      size === 'sm' && {
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation: 6,
      },
    ]}
    disabled={isDisabled}
  >
    <LinearGradient
      // Button Linear Gradient
      colors={isDisabled ? ['#fff', '#fff'] : ['#004c73', '#26a0da']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={[styles.button, isDisabled && styles.appButtonDisabled]}
    >
      {!!loading && <Loading text={loadingText} defaultSize={false} />}
      {!loading && (
        <ButtonText
          style={[
            size === 'sm' && { fontSize: 14 },
            !!titleSize && { fontSize: titleSize },
            isDisabled && { color: 'black' },
          ]}
        >
          {title}
        </ButtonText>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

export default AppButton;
