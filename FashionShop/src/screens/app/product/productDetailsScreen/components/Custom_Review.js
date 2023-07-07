import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    LogBox,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import scale from '../../../../../constants/responsive';
  import FONT_FAMILY from '../../../../../constants/fonts';
  import color from '../../../../../constants/color';
import { IC_Normal, IC_Satisfy, IC_UnSatisfy } from '../../../../../assets/icons';
  
  const Custom_Review = props => {
    console.log(props.image)
    return (
      <View key={props.id}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:scale(10)}}>
                <Image source={{uri: `${props.userAva}`}} resizeMode="cover" style={{width:scale(30),height:scale(30)}}/>
                <Text style={styles.userName}>{props.userName}</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between',marginLeft:scale(30),width:scale(120)}}>
                    <IC_UnSatisfy border={props.rate === '1' ? color.Primary:'#E0CFBA'}/>
                    <IC_Normal border={props.rate === '2' ? color.Primary:'#E0CFBA'}/>
                    <IC_Satisfy border={props.rate === '3' ? color.Primary:'#E0CFBA'}/>
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.type}>{'Type:'}</Text>
              <View
                style={{
                  backgroundColor: props.colorCode,
                  width: scale(25),
                  height: scale(25),
                  borderRadius: 360,
                  marginTop:scale(10),
                  marginLeft:scale(20),
                  marginRight: scale(10),
                  borderWidth: 1,
                }}
              />
              <Text style={styles.styleSizeName} numberOfLines={1}>
                {props.sizeName}
              </Text>
            </View>  
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.type}>{'Comment:'}</Text>          
              <Text style={styles.comment} numberOfLines={3}>
                {props.comment}
              </Text>
            </View>
          </View>
          {props.image === [] ? (null):(<View style={{flexDirection:'row',width:'91%',marginBottom:scale(20)}}>
            {props.image.map((item,index) => (
              <View
              key={item.public_id}
              style={{width: scale(60), height: scale(60),marginRight:scale(10)}}>
                <Image
                  resizeMode="cover"
                  style={{width: '100%', height: '100%'}}
                  source={{uri: `${item.url}`}}
                />
              </View>
            ))}
          </View>)}
        </View>
      </View>
    );
  };
  
  export default Custom_Review;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignSelf: 'center',
      borderBottomWidth: 1,
    },
    textContainer: {
      marginVertical:scale(15),
      width: scale(290),
      height: scale(100),
      flexDirection: 'column',
      alignSelf: 'center',
      justifyContent: 'space-between',
    },
    userName: {
      fontFamily: FONT_FAMILY.Regular,
      fontSize: scale(16),
      color: color.TitleActive,
      alignSelf:'center',
    },
    comment: {
      fontFamily: FONT_FAMILY.Regular,
      marginTop:scale(10),
      marginLeft:scale(10),
      fontSize: scale(16),
      color: color.TitleActive,
    },
    type: {
        fontFamily: FONT_FAMILY.Italic,
        marginTop:scale(10),
        fontSize: scale(16),
        color: color.TitleActive,
    },
    styleSizeName: {
      color: color.TitleActive,
      fontFamily: FONT_FAMILY.Regular,
      marginTop:scale(10),
      fontSize: scale(20),
      textAlign: 'left',
      letterSpacing: -0.39,
    },
    
  });
  