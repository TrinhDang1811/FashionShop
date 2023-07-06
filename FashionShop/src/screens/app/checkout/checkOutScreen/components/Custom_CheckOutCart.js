import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import Color from '../../../../../constants/color';

const Custom_CheckOutCart = props => {
  return (
    <View key={props.id}>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            source={{uri: `${props.img}`}}
            style={styles.img}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.prodName}>{props.name}</Text>
          <Text style={styles.prodDescription} numberOfLines={3}>
            {props.description}
          </Text>
          <View style={styles.viewValue}>
            <Text onChange style={styles.styleTextNumber}>
              {'Quantity: ' + props.qty}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.prodPrice}>${props.price * props.qty}</Text>
            <View style={styles.productColor}>
              <View
                style={{
                  borderRadius: 360,
                  backgroundColor: props.colorCode,
                  justifyContent: 'center',
                  width: scale(16),
                  height: scale(16),
                }}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: scale(10),
              }}>
              <Text style={styles.productSize}>{props.sizeName}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Custom_CheckOutCart;

const styles = StyleSheet.create({
  container: {
    // width: scale(343),
    height: scale(160),
    flexDirection: 'row',
    alignSelf: 'center',
    borderTopWidth: 1,
  },
  imgContainer: {
    alignSelf: 'center',
    width: scale(150),
    height: scale(150),
  },
  img: {
    width: '100%',
    height: scale(150),
  },
  textContainer: {
    width: scale(180),
    height: scale(150),
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  prodName: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(15),
    marginLeft: scale(10),
    color: Color.Body,
  },
  prodDescription: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(14),
    marginLeft: scale(10),
    color: Color.Label,
  },
  viewValue: {
    flexDirection: 'row',
    width: scale(70),
    marginLeft: scale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Sub: {
    borderRadius: 360,
    borderWidth: 1,
    borderColor: Color.Silver,
    width: scale(22),
    height: scale(22),
    alignItems: 'center',
  },
  textTouch: {
    fontFamily: FONT_FAMILY.Regular,
    fontWeight: '700',
    alignSelf: 'center',
    justifyContent: 'center',
    color: Color.Label,
    fontSize: scale(14),
  },
  prodPrice: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    color: Color.Secondary,
    marginLeft: scale(10),
  },
  productColor: {
    borderRadius: 360,
    borderColor: Color.PlaceHolder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(22),
    height: scale(22),
    marginLeft: scale(10),
  },
  productSize: {
    color: Color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(12),
    textAlign: 'center',
  },
  styleTextNumber: {
    color: Color.TitleActive,
    fontFamily: FONT_FAMILY.Italic,
    fontSize: scale(14),
    textAlign: 'center',
  },
});
