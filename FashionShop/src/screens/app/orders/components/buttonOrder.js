import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';

const ButtonOrder = props => {
  return (
    <TouchableOpacity style={(props.isRated===false || props.isRated===undefined)?styles.button:styles.buttonDisable}
      onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonOrder;

const styles = StyleSheet.create({
  button: {
    backgroundColor: color.TitleActive,
    borderRadius: 4,
    width: scale(112),
    height: scale(31),
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: scale(7),
  },
  buttonDisable: {
    backgroundColor: color.GraySolid,
    borderRadius: 4,
    width: scale(112),
    height: scale(31),
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight:scale(7)
  },
  text: {
    paddingHorizontal: scale(3),
    color: color.OffWhite,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(10),
    alignSelf: 'center',
    textAlign: 'center',
  },
});
