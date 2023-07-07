import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import scale from '../../../../constants/responsive';
import color from '../../../../constants/color';
import FONT_FAMILY from '../../../../constants/fonts';
import {IC_ShoppingBag} from '../../../../assets/icons';

const Button = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <IC_ShoppingBag stroke={color.White} />
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scale(56),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: color.TitleActive,
  },
  text: {
    fontWeight: '400',
    fontSize: scale(14),
    alignSelf: 'center',
    color: color.Background,
    fontFamily: FONT_FAMILY.Regular,
    marginLeft: scale(10),
  },
});
