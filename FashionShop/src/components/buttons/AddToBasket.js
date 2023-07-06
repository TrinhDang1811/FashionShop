import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import color from '../../constants/color';
import scale from '../../constants/responsive';
import {IC_Plus} from '../../assets/icons';
import FONT_FAMILY from '../../constants/fonts';

const AddToBasket = props => {
  const [liked, setLiked] = useState(false);
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.view}>
        <IC_Plus stroke={color.White} style={styles.IcPlus} />
        <Text style={styles.text}>ADD TO CART</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddToBasket;

const styles = StyleSheet.create({
  container: {
    height: scale(56),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.TitleActive,
    alignItems: 'center',
    paddingHorizontal: scale(14),
  },
  text: {
    marginLeft: scale(8),
    fontSize: scale(14),
    color: color.Background,
    lineHeight: scale(24),
    fontFamily: FONT_FAMILY.Regular,
  },
  view: {
    width: scale(147.84),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
