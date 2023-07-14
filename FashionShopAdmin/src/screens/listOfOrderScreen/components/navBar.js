import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState} from 'react'
//component
import scale from '../../../constants/responsive'
import FONT_FAMILY from '../../../constants/fonts'
import color from '../../../constants/color'
import { IC_CompleteOrder, IC_InProcessOrder, IC_NewOrder, IC_ReturnOrCancel, IC_ShippingOrder } from '../../../assets/icons'

const NavBar = (props) => {
    const {chosen, setChosen, setSubChosen, setMethod} = props;
  return (
    <View style={styles.bottomTabs}>
        <TouchableOpacity style={chosen=="new"?styles.touchTabChosen:styles.touchTab} onPress={() => {setChosen("new"), setMethod('Delivery')}}>
            <IC_NewOrder />
            <Text style={chosen=="new"?styles.textTabChosen:styles.textTab}>New</Text>
        </TouchableOpacity >

        <TouchableOpacity style={chosen=="in progress"?styles.touchTabChosen:styles.touchTab} onPress={()=>{setChosen("in progress"), setMethod('Delivery')}}>
            <IC_InProcessOrder />
            <Text style={chosen=="in progress"?styles.textTabChosen:styles.textTab}>In process</Text>
        </TouchableOpacity>

        <TouchableOpacity style={chosen=="shipping"?styles.touchTabChosen:styles.touchTab} onPress={()=>{setChosen("shipping"), setMethod('Delivery')}}>
            <IC_ShippingOrder />
            <Text style={chosen=="shipping"?styles.textTabChosen:styles.textTab}>Shipping/PUS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={chosen=="complete"?styles.touchTabChosen:styles.touchTab} onPress={()=>{setChosen("complete"), setMethod('Delivery')}}>
            <IC_CompleteOrder />
            <Text style={chosen=="complete"?styles.textTabChosen:styles.textTab}>Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={chosen=="return"?styles.touchTabChosen:styles.touchTab} onPress={()=>{setChosen("return"); setSubChosen('return'), setMethod('Delivery')}}>
            <IC_ReturnOrCancel />
            <Text style={chosen=="return"?styles.textTabChosen:styles.textTab}>Return/Cancel</Text>
        </TouchableOpacity>

      </View>
  )
}

export default NavBar

const styles = StyleSheet.create({
    bottomTabs:{
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        backgroundColor: color.White,
        marginBottom: 0
      },
    textTab:{
        marginTop: scale(5),
        color: color.TitleActive,
        fontSize: 10,
        fontFamily: FONT_FAMILY.Regular,
      },
      textTabChosen:{
        marginTop: scale(5),
        color: color.TitleActive,
        fontSize: 10,
        fontFamily: FONT_FAMILY.Regular,
      },
      touchTab:{
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: color.Primary,
        paddingVertical: scale(5),
    
      },
      touchTabChosen:{
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(5),
        backgroundColor: color.Alto,
        opacity: 0.76
      },
})