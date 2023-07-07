import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';
import ButtonOrder from './buttonOrder';

const {width: screenWidth} = Dimensions.get('window');

const PriceAttribute = props => {
  return (
    <View style={{flexDirection:'column'}}>
      <TouchableOpacity
        style={[props.style, styles.view1]}
        onPress={props.onPress}>
        <View style={styles.viewValue}>
          <Text style={styles.styleTextNumber}>x{props.qty}</Text>
        </View>
        <View style={{width: scale(40), height: scale(50)}}>
          <Image
            source={{uri: props.image}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        </View>
        <View style={styles.viewTextName}>
          <Text style={styles.styleTextName} numberOfLines={1}>
            {props.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: props.colorCode,
                width: scale(15),
                height: scale(15),
                borderRadius: 360,
                marginRight: scale(10),
                borderWidth: 1,
              }}
            />
            <Text style={styles.styleSizeName} numberOfLines={1}>
              {props.sizeName}
            </Text>
          </View>
        </View>  
        <View style={styles.viewPrice}>
          <Text style={styles.styleTextPrice}>${props.price}</Text>
        </View>
      </TouchableOpacity>
      {props.ratingData === null ? (null):(
      props.isRated === true ? (<ButtonOrder onPress={null} title={'RATED'} isRated={props.isRated}/>
      ):(<ButtonOrder onPress={props.onPressRating} title={'RATE'} />))}
    </View>
  );
};

export default PriceAttribute;

const styles = StyleSheet.create({
  view1: {
    width: screenWidth,
    height: scale(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewValue: {
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
  },
  styleTextNumber: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 16,
    color: color.TitleActive,
    textAlign: 'center',
    letterSpacing: -0.47,
  },
  viewTextName: {
    width: scale(200),
    // height: scale(27),
    marginLeft: scale(20),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  styleTextName: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(13),
    textAlign: 'left',
    letterSpacing: -0.39,
  },
  styleSizeName: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(12),
    textAlign: 'left',
    letterSpacing: -0.39,
  },
  viewPrice: {
    width: scale(120),
    height: scale(35),
    justifyContent: 'center',
    marginLeft: scale(20),
  },
  styleTextPrice: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 16,
    textAlign: 'left',
    letterSpacing: -0.39,
  },
});
