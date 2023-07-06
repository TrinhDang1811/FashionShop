import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import Color from '../../constants/color';
import {IMG_ModelTwo} from '../../assets/images/index';
import {IC_Star} from './index';

const Custom_ListViewProd = props => {
  const [Liked, setLike] = useState(false);
  return (
    <TouchableOpacity {...props}>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            source={IMG_ModelTwo}
            style={styles.img}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.prodName}>LAMEREI</Text>
          <Text style={styles.prodDescription}>
            Recycle Boucle Knit Cardigan
          </Text>
          <Text style={styles.prodPrice}>$120</Text>
          <IC_Star />
          <Text style={styles.prodRating}>4.8 Ratings</Text>
          <Text style={styles.prodSize}>Size</Text>
          <View style={styles.S}>
            <Text style={styles.prodType}>S</Text>
          </View>
          <View style={styles.M}>
            <Text style={styles.prodType}>M</Text>
          </View>
          <View style={styles.L}>
            <Text style={styles.prodType}>L</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Custom_ListViewProd;

const styles = StyleSheet.create({
  container: {
    width: scale(343),
    height: scale(134),
    flexDirection: 'row',
  },
  imgContainer: {
    width: scale(100),
    height: scale(134),
  },
  img: {
    position: 'absolute',
    width: scale(100),
    height: scale(134),
  },
  textContainer: {
    marginLeft: scale(12),
    width: scale(231),
    height: scale(134),
    overflow: 'hidden',
  },
  prodName: {
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    width: scale(231),
    height: scale(20),
    fontSize: scale(14),
    color: Color.Body,
    marginTop: scale(7),
  },
  prodDescription: {
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    width: scale(231),
    height: scale(20),
    fontSize: scale(13),
    color: Color.Label,
  },
  prodPrice: {
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    fontSize: scale(15),
    color: Color.Secondary,
    marginTop: scale(4),
    marginBottom: scale(11.25),
  },
  prodRating: {
    position: 'absolute',
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    fontSize: scale(12),
    color: Color.Label,
    top: scale(83),
    left: scale(16.51),
  },
  prodSize: {
    position: 'absolute',
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    fontSize: scale(12),
    color: Color.Label,
    top: scale(112),
  },
  prodType: {
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
    fontSize: scale(12),
    color: Color.Label,
    alignSelf: 'center',
  },
  S: {
    position: 'absolute',
    left: scale(36),
    borderColor: Color.Border,
    borderWidth: 1,
    top: scale(109),
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    borderRadius: 360,
  },
  M: {
    position: 'absolute',
    left: scale(66),
    borderColor: Color.Border,
    borderWidth: 1,
    top: scale(109),
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    borderRadius: 360,
  },
  L: {
    position: 'absolute',
    left: scale(96),
    borderColor: Color.Border,
    borderWidth: 1,
    top: scale(109),
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    borderRadius: 360,
  },
  heart: {
    position: 'absolute',
    top: scale(106),
    left: scale(200),
    padding: 1,
  },
});
