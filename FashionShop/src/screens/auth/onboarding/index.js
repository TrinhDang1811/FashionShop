import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import scale from '../../../constants/responsive';
import FONT_FAMILY from '../../../constants/fonts';
import Color from '../../../constants/color';
import {IMG_Logo} from '../../../assets/images';

const OnboardingScreen = props => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoBorder}>
        <Image source={IMG_Logo} style={styles.logo} />
      </View>
      <View style={styles.introBorder}>
        <Text style={styles.introText1}>Welcome</Text>
        <Text numberOfLines={2} style={styles.introText2}>
          Choose one option to update the latest fashion trends
        </Text>
      </View>
      <View style={styles.signInButtonView}>
        <TouchableOpacity
          style={styles.signInButtonPosition}
          onPress={() => props.navigation.navigate('SignInScreen')}>
          <View style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpButtonView}>
        <TouchableOpacity
          style={styles.signUpButtonPosition}
          onPress={() => props.navigation.navigate('SignUpScreen')}>
          <View style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewIcon: {
    backgroundColor: Color.Background,
    marginLeft: scale(26),
    width: scale(40),
    height: scale(30),
    marginTop: scale(22),
    alignItems: 'center',
  },
  logoBorder: {
    alignSelf: 'center',
  },
  logo: {
    width: scale(293),
    height: scale(279),
  },
  introBorder: {
    alignSelf: 'center',
    width: scale(254),
    height: scale(70),
  },
  introText1: {
    color: Color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(36),
    lineHeight: scale(40),
    alignSelf: 'center',
  },
  introText2: {
    color: Color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(18),
    lineHeight: scale(20),
    alignSelf: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  signInButtonView: {
    alignSelf: 'center',
  },
  signInButtonPosition: {
    position: 'absolute',
    marginTop: scale(75),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  signInButton: {
    justifyContent: 'center',
    borderWidth: scale(1),
    width: scale(301),
    height: scale(61),
  },
  signInButtonText: {
    color: Color.TitleActive,
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: scale(24),
    lineHeight: scale(26),
    alignSelf: 'center',
  },
  signUpButtonView: {
    alignSelf: 'center',
  },
  signUpButtonPosition: {
    position: 'absolute',
    marginTop: scale(150),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  signUpButton: {
    justifyContent: 'center',
    borderWidth: scale(1),
    width: scale(301),
    height: scale(61),
    backgroundColor: Color.TitleActive,
  },
  signUpButtonText: {
    color: Color.OffWhite,
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: scale(24),
    lineHeight: scale(26),
    alignSelf: 'center',
  },
});
