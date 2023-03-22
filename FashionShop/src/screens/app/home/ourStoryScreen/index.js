import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ScrollView
  } from 'react-native';
  import React, {useState} from 'react';
  import Custom_Header from '../../../../components/header/Custom_Header';
  import Custom_Footer from '../../../../components/footer/Custom_Footer';
  import color from '../../../../constants/color';
  import FONT_FAMILY from '../../../../constants/fonts';
  import { IC_BackwardArrow } from '../../../../assets/icons';
  import scale from '../../../../constants/responsive';
  import { LineBottom } from '../../../../components/footer/images';
  import { IMG_OurStory } from '../../../../assets/images';

  const OurStoryScreen = () => {  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
        <Custom_Header/>
        <View style={styles.introTextBox}>
            <Text style={styles.introText}>OUR STORY</Text>
            <Image source={LineBottom}/>
        </View>
        <View style={styles.bodyTextBox}>
          <Text numberOfLines={4} style={styles.bodyText}>     Fashion Shop is a project of Team 5 which is done in 3 months for 2 subjects: Software Engineering and Mobile Device Application Development.</Text>
          <Text numberOfLines={2} style={styles.bodyText}>     The app aims to support fashion store or fashion brand about online services.</Text>
          <Text numberOfLines={3} style={styles.bodyText}>     Team 5 has 4 members: Thanh Thảo, Đình Khôi, Thu Hiền, Phước Trí from University of Information Technology.</Text>
        </View>
        <View style={styles.ImageBox}>
            <Image source={IMG_OurStory} style={styles.img}/>
        </View>
        <Custom_Footer/>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default OurStoryScreen;
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    introTextBox:{
        alignSelf: 'center',
        marginTop: scale(10),
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
      marginTop: scale(10),
      width: scale(345),
      height: scale(246),
    },
    bodyText: {
      color: color.TitleActive,
      fontSize: 16,
      fontWeight: 400,
      fontFamily: FONT_FAMILY.Regular,
    },
    ImageBox: {
      marginTop: scale(-100),
      alignSelf: 'center',
    },
    img: {
      width: scale(380),
      height: scale(220),
    },
  });
  