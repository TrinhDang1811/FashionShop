import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import Color from '../../constants/color';
import {IC_ForwardArrow} from '../../assets/icons';

const Submit = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={styles.text}>SUBMIT</Text>
      <IC_ForwardArrow stroke={Color.White} style={styles.icon} />
    </TouchableOpacity>
  );
};

export default Submit;

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    height: scale(56),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Color.TitleActive,
  },
  text: {
    top: scale(4),
    height: scale(24),
    width: scale(120),
    fontWeight: '400',
    fontSize: scale(14),
    textAlign: 'center',
    color: Color.Background,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  icon: {
    top: scale(0),
    left: scale(-10),
  },
});
