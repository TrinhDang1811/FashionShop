import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import color from '../../../../../constants/color';
import Custom_Review from './Custom_Review';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import { LineBottom } from '../../../../../components/footer/images';
import { IC_Backward } from '../../../../../assets/icons';

const ProductRatingScreen = (props) => {
  const {data} = props.route.params;
  const axiosPrivate = useAxiosPrivate();
  const [userName, setUserName] = useState([]);
  const [userAva, setUserAva] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const getUserNameAndAvatar = async () => {
      const listOfNames = [];
      const listOfAvatars = [];
      await Promise.all(data.map(async(review) => {
        try {
          const response = await axiosPrivate.get(`/user/${review.userId}`, {
            signal: controller.signal, 
          });
          listOfNames.push(response.data.user.firstName + ' ' + response.data.user.lastName)
          listOfAvatars.push(response.data.user.avatarImage)
        } catch (err) {
          console.log(err.response.data);
        }
      }))
      setUserName(listOfNames);
      setUserAva(listOfAvatars);
    };
    
    getUserNameAndAvatar();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flexDirection: 'column',marginLeft:scale(5)}}>
      <TouchableOpacity
        style={styles.viewIcon}
        onPress={() => props.navigation.goBack()}>
        <IC_Backward />
      </TouchableOpacity>
        <Text style={styles.ratingText}>REVIEWS</Text>
        <Image source={LineBottom} style={{alignSelf: 'center'}} resizeMode='stretch'/>
        {data.map((item,index) => (
          <Custom_Review 
            id={index}
            userAva={userAva[index]}
            userName={userName[index]}
            rate={item.rate}
            comment={item.comment}
            image={item.image}
            sizeName={item.productDetailId.sizeId.name}
            colorCode={item.productDetailId.colorId.code}
          />
        ))}
        <Text style={styles.noMoreText}>No more reviews</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductRatingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.OffWhite,
  },
  viewIcon: {
    marginLeft: scale(30),
    width: scale(40),
    height: scale(30),
    marginTop: scale(23),
    alignItems: 'center',
  },
  noMoreText: {
    marginVertical: scale(30),
    textAlign:'center',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(25),
    color: color.Primary,
  },
  ratingText: {
    marginTop: scale(30),
    textAlign:'center',
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: scale(25),
    color: color.TitleActive,
  },
})