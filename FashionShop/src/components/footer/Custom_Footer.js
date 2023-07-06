import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import scale from '../../constants/responsive';
import FONT_FAMILY from '../../constants/fonts';
import color from '../../constants/color';
import {IC_Twitter, IC_Instagram, IC_Youtube} from './icons';
import {LineTop, LineBottom} from './images';

const url_Twitter = 'https://twitter.com/i/flow/login';
const url_Instagram = 'https://www.instagram.com/?hl=en';
const url_Youtube = 'https://www.youtube.com/';

const Custom_Footer = props => {
  const openUrl = async url => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Do not know how to open this url: ${url}');
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        {/* Twitter */}
        <TouchableOpacity
          onPress={() => {
            openUrl(url_Twitter);
          }}>
          <IC_Twitter />
        </TouchableOpacity>
        {/* Instagram */}
        <TouchableOpacity
          style={{marginLeft: scale(49)}}
          onPress={() => {
            openUrl(url_Instagram);
          }}>
          <IC_Instagram />
        </TouchableOpacity>
        {/* Youtube */}
        <TouchableOpacity
          style={{marginLeft: scale(49)}}
          onPress={() => {
            openUrl(url_Youtube);
          }}>
          <IC_Youtube />
        </TouchableOpacity>
      </View>
      {/* Line Top */}
      <Image source={LineTop} style={styles.lineTop} />
      {/* Body Text */}
      <View style={styles.bodyTextContainer}>
        <Text style={styles.bodyText}>
          {'fashionshopapp5@gmail.com\n+84912345678\n08:00 - 22:00 - Everyday'}
        </Text>
      </View>
      {/* Line Bottom */}
      <Image source={LineBottom} style={styles.lineBottom} />
      <>
        <View style={styles.buttonContainer}>
          {/* About Button */}
          <TouchableOpacity onPress={props.onAboutPress}>
            <Text style={styles.aboutText}>About</Text>
          </TouchableOpacity>
          {/* Contact Button */}
          <TouchableOpacity
            style={{marginLeft: scale(52)}}
            onPress={props.onContactPress}>
            <Text style={styles.contactText}>Contact</Text>
          </TouchableOpacity>
          {/* Blog Button */}
          <TouchableOpacity
            style={{marginLeft: scale(52)}}
            onPress={props.onBlogPress}>
            <Text style={styles.blogText}>Blog</Text>
          </TouchableOpacity>
        </View>
      </>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          Copyright© FashionShop5 All Rights Reserved.
        </Text>
      </View>
    </View>
  );
};

export default Custom_Footer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: scale(20),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineTop: {
    alignSelf: 'center',
    marginTop: scale(24),
  },
  bodyTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(19),
  },
  bodyText: {
    fontSize: scale(16),
    lineHeight: scale(29),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    color: color.Body,
  },
  lineBottom: {
    alignSelf: 'center',
    marginTop: scale(19),
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: scale(32),
  },
  aboutText: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    lineHeight: scale(24),
    textAlign: 'center',
    color: color.TitleActive,
  },
  contactText: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    lineHeight: scale(24),
    textAlign: 'center',
    color: color.TitleActive,
  },
  blogText: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    lineHeight: scale(24),
    textAlign: 'center',
    color: color.TitleActive,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C4C4C4',
    width: '100%',
    opacity: 0.17,
    marginTop: scale(23),
  },
  labelText: {
    paddingVertical: scale(12),
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(13),
    lineHeight: scale(19),
    textAlign: 'center',
    color: color.Label,
    opacity: 1,
  },
});
