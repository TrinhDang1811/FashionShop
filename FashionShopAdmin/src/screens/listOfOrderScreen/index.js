import { StyleSheet, Text, View , SafeAreaView, TouchableOpacity, Dimensions} from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native';
//lib
import * as Progress from 'react-native-progress';
//component
import color from '../../constants/color'
import FONT_FAMILY from '../../constants/fonts'
import HeaderMin from '../../components/header/headerMin'
import NavBar from './components/navBar'
import Order from './components/order'
import UnderLine from '../../components/underLineSwitch/underLineSwitch'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { displayDateTime } from '../../config/displayDateTime'


const ListOfOrderScreen = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const isFocus = useIsFocused();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/get-all-order', {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setOrders(response.data.orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    
    getOrders();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isFocus]);

  const [chosen, setChosen] = useState('new');
  const [method, setMethod] = useState('Delivery');
  const [subChosen, setSubChosen] = useState('return');
  const windowWidth = Dimensions.get('window').width;
  return (
    <SafeAreaView style={styles.container}>
      <HeaderMin text={"List of orders"} onPress={()=>props.navigation.goBack()}/>
      {loading && <Progress.Bar
                indeterminate={true} 
                width={windowWidth} 
                borderRadius={0} 
                color={color.Secondary} 
                borderWidth={0} 
                height={3}/>}
      {(chosen==='cancel' || chosen==='return')?(
          <View style={{flexDirection: 'row'}}>
            <UnderLine text={'Return'} name={'return'} onPress={() => {setSubChosen('return'), setChosen('return')}} chosen={subChosen}/>
            <UnderLine text={'Canceled'} name={'cancel'} onPress={() => {setSubChosen('cancel'), setChosen('cancel')}} chosen={subChosen}/>
          </View>
      ):(null)}
      {(chosen==='shipping')?(
          <View style={{flexDirection: 'row'}}>
            <UnderLine text={'Shipping'} name={'Delivery'} onPress={() => {setMethod('Delivery'), setChosen('shipping')}} chosen={method}/>
            <UnderLine text={'PickUp at store'} name={'PickUp at store'} onPress={() => {setMethod('PickUp at store')}} chosen={method}/>
          </View>
      ):(null)}
      {method === 'PickUp at store' ? 
      (<ScrollView style={{flex: 1}}>
        {orders.map((item,index) => (item.orderMethod === 'PickUp at store') && (
          <TouchableOpacity key={item._id} onPress={() => props.navigation.navigate('OrderDetail', {order: item})}>
            <Order number={index+1} userName={item.userName} orderTime={displayDateTime(item.orderDate)} orderId={item._id} totalPrice={item.orderTotalPrice} userAvatar={item.userAvatar}/>
          </TouchableOpacity>
        ))}
      </ScrollView>):(
      <ScrollView style={{flex: 1}}>
        {orders.map((item,index) => (item.orderStatus === chosen) && (
          <TouchableOpacity key={item._id} onPress={() => props.navigation.navigate('OrderDetail', {order: item})}>
            <Order number={index+1} userName={item.userName} orderTime={displayDateTime(item.orderDate)} orderId={item._id} totalPrice={item.orderTotalPrice} userAvatar={item.userAvatar}/>
          </TouchableOpacity>
        ))}
      </ScrollView>)}
      <NavBar chosen={chosen} setChosen={setChosen} setSubChosen={setSubChosen}/>
    </SafeAreaView>
  )
}

export default ListOfOrderScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
},
header:{
    flexDirection: 'row',
    backgroundColor: color.TitleActive,
    flex:0.1,
    alignItems: 'center'
},
textHeader:{
    color: color.White,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 24,
},
body:{
    flex: 0.9,
    backgroundColor: color.White,
}
})