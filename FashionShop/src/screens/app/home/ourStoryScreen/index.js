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
import React from 'react';
import Custom_Footer from '../../../../components/footer/Custom_Footer';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';
import {LineBottom} from '../../../../components/footer/images';
import {IMG_OurStory} from '../../../../assets/images';

const OurStoryScreen = props => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.introTextBox}>
          <Text style={styles.introText}>OUR STORY</Text>
          <Image source={LineBottom} />
        </View>
        <View style={styles.bodyTextBox}>
          <Text numberOfLines={4} style={styles.bodyText}>
            {' '}
            Fashion Shop is a project of Team 5 which is done in 3 months for 2
            subjects: Software Engineering and Mobile Device Application
            Development.
          </Text>
          <Text numberOfLines={2} style={styles.bodyText}>
            {' '}
            The app aims to support fashion store or fashion brand about online
            services.
          </Text>
          <Text numberOfLines={3} style={styles.bodyText}>
            {' '}
            Team 5 has 4 members: Thanh Thảo, Đình Khôi, Thu Hiền, Phước Trí
            from University of Information Technology.
          </Text>
        </View>
        <View style={styles.ImageBox}>
          <Image source={IMG_OurStory} style={styles.img} />
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

export default OurStoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  introTextBox: {
    alignSelf: 'center',
    marginTop: scale(20),
  },
  introText: {
    color: color.TitleActive,
    fontSize: 18,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
    letterSpacing: 4,
  },
  bodyTextBox: {
    alignSelf: 'center',
    marginTop: scale(20),
    padding: 10,
  },
  bodyText: {
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  ImageBox: {
    marginTop: scale(20),
    alignSelf: 'center',
    paddingVertical: scale(20),
  },
  img: {
    width: scale(380),
    height: scale(220),
  },
});
