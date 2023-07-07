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
import {
  IC_Twitter,
  IC_Instagram,
  IC_Youtube,
} from '../../../../components/footer/icons';
import scale from '../../../../constants/responsive';
import color from '../../../../constants/color';
import {LineTop} from '../../../../components/footer/images';

const url_Twitter = 'https://twitter.com/i/flow/login';
const url_Instagram = 'https://www.instagram.com/?hl=en';
const url_Youtube = 'https://www.youtube.com/';

const Custom_MenuFooter = () => {
  const openUrl = async url => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Do not know how to open this url: ${url}');
    }
  };

  return (
    <View style={styles.container}>
      {/* Line Top */}
      <Image source={LineTop} style={styles.lineTop} />
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
    </View>
  );
};

export default Custom_MenuFooter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.White,
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
    marginBottom: scale(24),
  },
});
