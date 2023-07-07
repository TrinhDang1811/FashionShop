import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import Color from '../../constants/color';

const SubmitNone = props => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props.type === 'primary'
          ? styles.buttonPrimary
          : styles.buttonSecondary,
      ]}
      onPress={props.onPress}>
      <Text
        style={[
          styles.text,
          props.type === 'primary' ? styles.textPrimary : styles.textSecondary,
        ]}>
        {props.type === 'primary' ? props.textPrimary : props.textSecondary}
        {/*textPrimary= "SUBMIT", textSecondary="BACK TO HOME" */}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitNone;

const styles = StyleSheet.create({
  container: {
    width: scale(132),
    height: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '400',
    fontSize: scale(16),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  buttonPrimary: {
    backgroundColor: Color.TitleActive,
  },
  buttonSecondary: {
    borderColor: Color.White,
    borderWidth: 1,
  },
  textPrimary: {
    color: Color.Background,
  },
  textSecondary: {
    color: Color.TitleActive,
  },
});
