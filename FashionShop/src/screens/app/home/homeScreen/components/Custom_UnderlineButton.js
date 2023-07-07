import {StyleSheet, Text, Pressable} from 'react-native';
import React from 'react';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import color from '../../../../../constants/color';

const Custom_UnderlineButton = props => {
  const {isChoosing, onPress, style, textStyle, children} = props;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: scale(3),
      }}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
      <Text style={[styles.background(isChoosing), style]}>◆</Text>
    </Pressable>
  );
};

export default Custom_UnderlineButton;

const styles = StyleSheet.create({
  background: isChoosing => ({
    alignSelf: 'center',
    color: isChoosing ? color.Primary : 'transparent',
  }),
  text: {
    color: color.PlaceHolder,
    paddingHorizontal: scale(26),
    fontWeight: '400',
    fontSize: scale(4),
    alignSelf: 'center',
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
});
