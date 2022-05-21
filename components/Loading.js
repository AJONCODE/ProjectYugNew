import { Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import spinner from '../images/spinner.gif';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 45,
    height: 45,
  },
  spinnerSmall: {
    width: 20,
    height: 20,
  },
  spinnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 55,
  },
  spinnerTextSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

const Loading = ({
  text = 'Loading',
  spinnerImg = true,
  defaultSize = true,
  speed = 300,
}) => {
  const [content, setContent] = React.useState(text);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setContent((content) =>
        content === `${text}...` ? setContent(text) : setContent(`${content}.`),
      );
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <View style={styles.container}>
      <Text style={defaultSize ? styles.spinnerText : styles.spinnerTextSmall}>
        {` `}
        {spinnerImg && (
          <Image
            source={spinner}
            style={defaultSize ? styles.spinner : styles.spinnerSmall}
          />
        )}

        {content}
      </Text>
    </View>
  );
};

export default Loading;
