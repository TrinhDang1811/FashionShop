import {StyleSheet, Text, Pressable, View} from 'react-native';
import React from 'react';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';

const Custom_UnderlineButtonMenu = props => {
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
      <View style={{flexDirection: 'row'}}>
        <View style={[styles.borderColor(isChoosing), styles.lineStyle]}></View>
        <Text
          style={[
            styles.background(isChoosing),
            style,
            {letterSpacing: scale(-3)},
          ]}>
          ◆
        </Text>
        <View style={[styles.borderColor(isChoosing), styles.lineStyle]}></View>
      </View>
    </Pressable>
  );
};

export default Custom_UnderlineButtonMenu;

const styles = StyleSheet.create({
  background: isChoosing => ({
    alignSelf: 'center',
    color: isChoosing ? color.Primary : color.GraySolid,
  }),
  borderColor: isChoosing => ({
    borderColor: isChoosing ? color.Primary : color.GraySolid,
  }),
  text: {
    color: color.TitleActive,
    paddingHorizontal: scale(26),
    fontWeight: '400',
    fontSize: scale(4),
    alignSelf: 'center',
    fontFamily: FONT_FAMILY.Regular,
  },
  lineStyle: {
    borderBottomWidth: 1,
    alignSelf: 'center',
    height: scale(1),
    width: scale(80),
    marginTop: scale(4),
  },
});
