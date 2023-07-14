import { StyleSheet, Text, View,SafeAreaView,Image,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
//component
import { IC_Edit,IC_Delete,IC_See } from '../../../assets/icons'
import scale from '../../../constants/responsive'
import FONT_FAMILY from '../../../constants/fonts'
import color from '../../../constants/color'

const Item = (props) => {



  return (
    <TouchableOpacity style={styles.viewItem} onPress={props.onPress}>
                <View style={styles.viewNumber}>
                    <Text style={styles.number} >{props.number}</Text>
                </View>
                <View style={styles.viewImage}>
                    <Image style={styles.image} source={{uri: props.source || 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg'}}></Image>
                </View>
                <View style={styles.viewDescription}>
                    <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
                    <Text style={styles.description} numberOfLines={1}>{props.description}</Text>
                    <Text style={styles.price} numberOfLines={1}>{props.price}$</Text>
                    <Text style={styles.sale} numberOfLines={1}>Sale: {props.sale}</Text>

                </View>
                <View style={styles.viewFunction}>
                    <TouchableOpacity style={styles.viewIcon} onPress={props.delete}>
                    <IC_Delete></IC_Delete>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewIcon} onPress={props.onPressEdit}>
                    <IC_Edit></IC_Edit>
                    </TouchableOpacity>
                    
                </View>
    </TouchableOpacity>
  )
}

export default Item;

const styles = StyleSheet.create({
    viewItem:{
        width: '100%',
        height: scale(150),
        flexDirection: 'row',
        alignItems: 'center',
      },
      viewNumber:{
        width: '6%',
        justifyContent: 'center',

      },
      number:{
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: FONT_FAMILY.Regular,
        color: color.TitleActive,

      },
      viewImage:{
        width:'25%',
        height: scale(130),
        justifyContent: 'center',
        
      },
      image:{
        width: '75%',
        height: '75%',
        alignSelf: 'center'
      },
      viewDescription:{
        flexDirection: 'column',
        width: '45%',
      },
      name:{
        fontSize: 14,
        fontFamily: FONT_FAMILY.Regular,
        color: color.TitleActive,
      },
      description:{
        fontSize: 14,
        fontFamily: FONT_FAMILY.Regular,
        color: color.GraySolid,
      },
      price:{
        fontSize: 14,
        fontFamily: FONT_FAMILY.Regular,
        color: color.Primary,
      },
      sale:{
        fontSize: 14,
        fontFamily: FONT_FAMILY.Regular,
        color: color.TitleActive,
      },
      viewFunction:{
        width: '25%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around'
      },
      viewIcon:{
        width: scale(30),
        height: scale(30),
        justifyContent: 'center',
        alignItems: 'center'
      }
      
})