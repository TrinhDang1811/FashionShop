import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import Color from '../../constants/color';

const SaveButton = props => {
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

export default SaveButton;

const styles = StyleSheet.create({
  container: {
    width: scale(295),
    height: scale(61),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.TitleActive,
    marginBottom: scale(20),
  },
  text: {
    fontSize: scale(24),
    textAlign: 'center',
    color: Color.White,
    fontFamily: FONT_FAMILY.BoldSecond,
  },
});
