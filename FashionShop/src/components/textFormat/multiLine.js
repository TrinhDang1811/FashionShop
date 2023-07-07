import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';

const MultiLine = props => {
  return (
    <TextInput
      style={styles.inputText}
      placeholder={props.placeholder}
      placeholderTextColor={color.PlaceHolder}
      selectionColor={color.GraySolid}
      onChangeText={props.onChangeText}
      keyboardAppearance="dark"
      keyboardType={props.keyboardType}
      multiline={true}
      maxLength={500}
      defaultValue={props.defaultValue}
    />
  );
};

export default MultiLine;

const styles = StyleSheet.create({
  inputText: {
    color: color.TitleActive,
    borderWidth: 1,
    borderColor: color.PlaceHolder,
    fontFamily: FONT_FAMILY.Regular,
    textAlignVertical: 'top',
    fontSize: scale(16),
    paddingBottom: scale(5),
    width: '80%',
    minHeight: scale(100),
    maxHeight: scale(150),
    alignContent: 'center',
    paddingHorizontal: scale(10),
  },
});
