import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import Color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';

const BackToHome = props => {
  return (
    <View style={styles.view}>
      <TouchableOpacity
        style={[
          styles.buttonView,
          props.type === 'primary'
            ? styles.buttonPrimary
            : styles.buttonSecondary,
        ]}
        onPress={props.onPress}>
        <Text
          style={[
            styles.text,
            props.type === 'primary'
              ? styles.textButtonPrimary
              : styles.textButtonSecondary,
          ]}>
          BACK TO HOME
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackToHome;

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  buttonView: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    justifyContent: 'center',
  },
  text: {
    fontWeight: '400',
    fontSize: scale(16),
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    alignSelf: 'center',
  },
  buttonPrimary: {
    backgroundColor: Color.TitleActive,
  },
  buttonSecondary: {
    borderColor: Color.Primary,
    borderWidth: 1,
  },
  textButtonPrimary: {
    color: Color.Background,
  },
  textButtonSecondary: {
    color: Color.TitleActive,
  },
});
