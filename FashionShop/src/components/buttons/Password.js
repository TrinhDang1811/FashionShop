import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import Color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';

const ShowOrHideButton = props => {
  return (
    <TouchableOpacity
      style={[styles.container, {opacity: props.disabled ? 0.75 : 1}]}
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text style={styles.text}>{props.text}</Text>
      {props.loading ? (
        <ActivityIndicator
          size="large"
          color={Color.White}
          style={{position: 'absolute', right: scale(20)}}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default ShowOrHideButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '400',
    fontSize: scale(18),
    textAlign: 'center',
    color: Color.TitleActive,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
});
