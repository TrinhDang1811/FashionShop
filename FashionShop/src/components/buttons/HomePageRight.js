import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import Color from '../../constants/color';
import {IC_ForwardArrow} from '../../assets/icons';

const HomePageRight = props => {
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
        HOME PAGE
      </Text>
      <IC_ForwardArrow
        stroke={props.type === 'primary' ? Color.White : Color.TitleActive}
        style={[
          props.type === 'primary' ? styles.iconPrimary : styles.iconSecondary,
        ]}></IC_ForwardArrow>
    </TouchableOpacity>
  );
};

export default HomePageRight;

const styles = StyleSheet.create({
  container: {
    width: scale(196),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '400',
    fontSize: scale(16),
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
  iconPrimary: {
    left: scale(10.89),
  },
  iconSecondary: {
    left: scale(10.89),
  },
});
