import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import Color from '../../constants/color';

const Custom_Tag1 = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.fill, {marginLeft: props.marginLeft || scale(0)}]}>
      <Text style={styles.text}>{props.value}</Text>
    </TouchableOpacity>
  );
};

export default Custom_Tag1;

const styles = StyleSheet.create({
  fill: {
    alignSelf: 'center',
    borderRadius: scale(30),
    paddingHorizontal: scale(8),
    paddingVertical: scale(10),
    backgroundColor: Color.InputBackground,
  },
  text: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(14),
    color: Color.Body,
    alignSelf: 'center',
  },
});
