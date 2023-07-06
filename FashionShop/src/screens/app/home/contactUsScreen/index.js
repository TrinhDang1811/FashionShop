import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import Custom_Footer from '../../../../components/footer/Custom_Footer';
import OKMessageBox from '../../../../components/messageBox/OKMessageBox';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';
import {LineBottom} from '../../../../components/footer/images';
import {IC_ContactCall, IC_ContactText} from '../../../../assets/icons';

const ContactUsScreen = props => {
  const [chooseButton, setChooseButton] = useState('call');
  const [visible, setVisible] = useState(false);

  const addToClipboard = textToCopy => {
    Clipboard.setString(textToCopy);
    setVisible(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <OKMessageBox
        visible={visible}
        clickCancel={() => {
          setVisible(false);
        }}
        title={chooseButton === 'call' ? 'OUR PHONE NUMBER' : 'OUR EMAIL'}
        message={
          chooseButton === 'call' ? '0912345678' : 'fashionshopapp5@gmail.com'
        }
      />
      <ScrollView>
        <View style={styles.introTextBox}>
          <Text style={styles.introText}>CONTACT US</Text>
          <Image source={LineBottom} />
        </View>
        <View style={styles.bodyTextBox}>
          <IC_ContactCall style={styles.call} />
          <Text numberOfLines={3} style={styles.bodyText}>
            {'     '}
            Need an ASAP answer? Contact us via phone, from 8:00 to 18:00,
            everyday! We are always ready to serve you.
          </Text>
          <TouchableOpacity
            style={styles.CallButtonPosition}
            onPress={() => {
              addToClipboard('0912345678');
              setChooseButton('call');
            }}>
            <View style={styles.CallButton}>
              <Text style={styles.buttonCall}>CALL US</Text>
            </View>
          </TouchableOpacity>
          <IC_ContactText style={styles.text} />
          <Text numberOfLines={9} style={styles.bodyText1}>
            {'     '}
            You can text us at 0912345678 – or click on the “text us” link below
            on your mobile device. Please allow the system to acknowledge a
            simple greeting before providing your question/order details.
            Consent is not required for any purchase. Message and data rates may
            apply. Text messaging may not be available via all carriers.
          </Text>
          <TouchableOpacity
            style={styles.TextButtonPosition}
            onPress={() => {
              addToClipboard('fashionshopapp5@gmail.com');
              setChooseButton('text');
            }}>
            <View style={styles.TextButton}>
              <Text style={styles.buttonText}>TEXT US</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Custom_Footer
          onAboutPress={() =>
            props.navigation.navigate('HomeStackScreen', {
              screen: 'OurStoryScreen',
            })
          }
          onContactPress={() =>
            props.navigation.navigate('HomeStackScreen', {
              screen: 'ContactUsScreen',
            })
          }
          onBlogPress={() =>
            props.navigation.navigate('BlogStackScreen', {
              screen: 'BlogGridViewScreen',
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  introTextBox: {
    alignSelf: 'center',
    marginTop: scale(10),
  },
  introText: {
    color: color.TitleActive,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: FONT_FAMILY.Regular,
    letterSpacing: 4,
  },
  bodyTextBox: {
    alignSelf: 'center',
    marginTop: scale(10),
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  bodyText: {
    marginTop: scale(10),
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILY.Regular,
  },
  bodyText1: {
    marginTop: scale(15),
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILY.Regular,
  },
  call: {
    alignSelf: 'center',
    marginTop: scale(20),
  },
  CallButtonPosition: {
    marginTop: scale(20),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  CallButton: {
    justifyContent: 'center',
    width: scale(130),
    height: scale(40),
    backgroundColor: color.TitleActive,
  },
  buttonCall: {
    color: color.White,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    fontWeight: '400',
    alignSelf: 'center',
  },
  text: {
    alignSelf: 'center',
    marginTop: scale(20),
  },
  buttonText: {
    color: color.White,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    fontWeight: '400',
    alignSelf: 'center',
  },
  TextButtonPosition: {
    marginTop: scale(20),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TextButton: {
    justifyContent: 'center',
    width: scale(130),
    height: scale(40),
    backgroundColor: color.TitleActive,
  },
});
