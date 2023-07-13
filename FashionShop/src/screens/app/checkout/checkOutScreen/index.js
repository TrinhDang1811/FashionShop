import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Icon,
  RefreshControl,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {initCartLogIn, resetCartOrder} from '../../../../redux/actions/cartActions';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import {initAddress} from '../../../../redux/actions/addressActions';
import Custom_CheckOutCart from './components/Custom_CheckOutCart';
import scale from '../../../../constants/responsive';
import color from '../../../../constants/color';
import FONT_FAMILY from '../../../../constants/fonts';
import OKMessageBox from '../../../../components/messageBox/OKMessageBox'
import {LineBottom} from '../../../../components/footer/images';
import {IC_Forward, IC_Location, IC_Plus} from '../../../../assets/icons';

const CheckOut = props => {
  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;
  const axiosPrivate = useAxiosPrivate();
  const [method, setMethod] = useState([
    {label: 'Ship COD - $5', value: 5},
    {label: 'Pickup at store - FREE', value: 0},
  ]);
  const [methodValue, setMethodValue] = useState(5);
  const [methodOpen, setMethodOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [visibleError, setVisibleError] = useState(false);
  const {handleSubmit, control} = useForm();

  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState(0);
  const [visible, setVisible] = useState(true);
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const {cartId} = cart;
  console.log({cartId});
  const [note, setNote] = useState('');
  const checkOutCart = cartItems.filter(item => item.isOrder === true);
  const [addressDefault, setAddressDefault] = useState([]);
  const address = useSelector(state => state.address);
  const {addresses} = address;
  const {addressesId} = address;
  const locationUrl =
    'https://www.google.com/maps/search/UIT/@10.824217,106.7037515,13z/data=!3m1!4b1?hl=vi-VN';
  const openUrl = async url => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(`Do not know how to open this url: ${url}`);
    }
  };
  useEffect(() => {
    onCalculateAmount();

    if (totalAmount === 0) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [checkOutCart, totalAmount]);

  const isFocus = useIsFocused();
  useEffect(() => {
    const controller = new AbortController();

    const getAddressById = async () => {
      try {
        const response = await axiosPrivate.get(
          `/get-address-by-user-id/${userInfo._id}`,
          {
            signal: controller.signal,
          },
        );
        console.log('address: ', JSON.stringify(response?.data));
        dispatch(initAddress(response?.data?.address));
        console.log(addresses);
        setAddressDefault(
          response?.data?.address.addresses.filter(
            item => item.isDefault === true,
          ),
        );
        console.log({addressDefault});
      } catch (err) {
        console.log(err.response);
      }
    };
    getAddressById();
    return () => {
      controller.abort();
    };
  }, [isFocus]);

  const onCalculateAmount = () => {
    let total = 0;
    if (Array.isArray(cartItems)) {
      checkOutCart.map(item => {
        total += item.product.price * item.qty;
      });
    }
    setTotalAmount(total);
  };

  const resetCartHandler = async id => {
    try {
      const response = await axiosPrivate.put(`/reset-cart-item/${id}`);
      console.log('resetCartSuccess', JSON.stringify(response.data));
      dispatch(resetCartOrder());
    } catch (error) {
      console.log('error', error.response.data);
    }
  };
  const getCart = async id => {
    try {
      console.log('userId', id);
      const responseCart = await axiosPrivate.get(
        `/get-cart-by-user-id/${id}`,
      );
      console.log('------');
      dispatch(initCartLogIn(responseCart.data));
    } catch (err) {
      console.log('err', err);
    }
  };
  const placeOrderHandler = async () => {
    try {
      const orderCart = [];
      checkOutCart.map(item => {
        const orderCartItem = {
          productDetailId: item.detailId,
          quantity: item.qty,
        };
        orderCart.push(orderCartItem);
      });
      console.log({orderCart});
      console.log({cartId});
      console.log({addressDefault});
      console.log({note});
      console.log({methodValue});
      const response = await axiosPrivate.post(
        `/create-order`,
        methodValue === 5
          ? JSON.stringify({
              userId: userInfo._id,
              productDetails: orderCart,
              note: note,
              address: addressDefault[0],
              orderMethod: 'Delivery',
            })
          : JSON.stringify({
              userId: userInfo._id,
              productDetails: orderCart,
              note: note,
              orderMethod: 'PickUp at store',
            }),
      );
      console.log('placeOrderSuccess', JSON.stringify(response.data));
      console.log({cartId});
      resetCartHandler(cartId);
      setNote('');
      props.navigation.navigate('OrderSuccess', {
        data: {
          orderId: response.data.order._id,
          user: userInfo,
          productDetails: checkOutCart,
          note: note,
          address: addressDefault[0],
          methodValue: methodValue,
          orderTotalPrice: totalAmount + methodValue,
        },
      });
    } catch (error) {
      console.log('error', error.response.data);
      getCart(userInfo._id);
      setVisibleError(true);
      setMessage(error.response.data.error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <OKMessageBox visible={visibleError} 
          clickCancel={() => props.navigation.navigate('CartScreen')} 
          title={'Error'} 
          message={message}/>
      <ScrollView>
        <View style={styles.introTextBox}>
          <Text style={styles.introText}>CHECKOUT</Text>
          <Image source={LineBottom} />
        </View>
        <View style={styles.address}>
          <Text style={styles.bodyText1}>SHIPPING ADDRESS</Text>
          {addressDefault[0] === undefined ? (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: scale(20),
                marginTop: scale(20),
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: FONT_FAMILY.Regular,
                  fontSize: scale(16),
                  color: color.RedSolid,
                }}>
                {'You need add address for your order!'}
              </Text>
            </View>
          ) : methodValue === 5 ? (
            <View style={{height: scale(110)}}>
              {addressDefault.map(item => (
                <TouchableOpacity
                  style={styles.bodyTextBox}
                  key={item._id}
                  onPress={() =>
                    props.navigation.navigate('ListOfAddressesScreen', {
                      prevScreen: 'checkout',
                    })
                  }>
                  <View style={{flexDirection: 'column', width: '80%'}}>
                    <Text style={styles.name}>
                      {userInfo.firstName + ' ' + userInfo.lastName}
                    </Text>
                    <Text numberOfLines={2} style={styles.bodyText}>
                      {item.streetAndNumber +
                        ', ' +
                        item.ward +
                        ', ' +
                        item.district +
                        ', ' +
                        item.city}
                    </Text>
                    <Text style={styles.bodyText}>{userInfo.phoneNumber}</Text>
                  </View>
                  <IC_Forward style={styles.ForwardPosition} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: scale(20),
              }}>
              <View style={{flexDirection: 'column', marginRight: scale(50)}}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.Regular,
                    fontSize: scale(15),
                    color: color.TitleActive,
                  }}>
                  Shop's location:
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: FONT_FAMILY.Regular,
                    fontSize: scale(14),
                    color: color.TitleActive,
                  }}>
                  {'    University Of Information Technology '}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.Regular,
                    fontSize: scale(15),
                    color: color.TitleActive,
                  }}>
                  {'Contact number: (786) 713-8616'}
                </Text>
              </View>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => {
                  openUrl(locationUrl);
                }}>
                <IC_Location />
              </TouchableOpacity>
            </View>
          )}
          <View>
            {addressDefault[0] === undefined ? (
              <TouchableOpacity
                style={styles.addShipping}
                onPress={() =>
                  props.navigation.navigate('AddNewAddressScreen')
                }>
                <Text style={styles.addShippingText}>ADD SHIPPING ADDRESS</Text>
                <IC_Plus
                  style={styles.PlusPosition}
                  stroke={color.TitleActive}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          {/* NOTE */}
          <Text style={styles.bodyText1}>NOTE</Text>
          <View style={styles.viewInput}>
            <TextInput
              onChangeText={note => setNote(note)}
              value={note}
              style={styles.inputText}
            />
          </View>
          <View style={styles.method}>
            <Text style={styles.bodyText1}>SHIPPING METHOD</Text>
            <Controller
              name="SHIPPING METHOD"
              defaultValue={5}
              control={control}
              render={({field: {onChange, value}}) => (
                <View style={styles.dropdown}>
                  <DropDownPicker
                    style={styles.dropdownContainer}
                    dropDownContainerStyle={styles.dropdownContainer}
                    listMode="SCROLLVIEW"
                    textStyle={styles.bodyText}
                    open={methodOpen}
                    value={methodValue}
                    items={method}
                    setOpen={setMethodOpen}
                    setValue={setMethodValue}
                    setItems={setMethod}
                    placeholder="Choose shipping method"
                    onChangeValue={onChange}
                  />
                </View>
              )}
            />
          </View>
        </View>

        {/* Cart Items */}
        <View style={methodValue === 5? styles.viewScrollOnline:styles.viewScrollOffline}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {checkOutCart.map(item => (
              <View key={item.detailId}>
                <Custom_CheckOutCart
                  id={item.detailId}
                  qty={item.qty}
                  name={item.product.name}
                  description={item.product.description}
                  price={item.product.price}
                  img={item.product.posterImage.url}
                  colorCode={item.colorCode}
                  sizeName={item.sizeName}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <View />
      </ScrollView>
      <View style={styles.totalBorder}>
        <Text style={styles.total}>TOTAL</Text>
        <Text style={styles.price}>${totalAmount + methodValue}</Text>
      </View>
      {addressDefault[0] === undefined ? (
        <TouchableOpacity style={styles.placeOrderDisable} onPress={null}>
          <Text style={styles.buttonDisable}>PLACE ORDER</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.placeOrder}
          onPress={() => placeOrderHandler()}>
          <Text style={styles.button}>PLACE ORDER</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default CheckOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  viewInput: {
    width: '90%',
    height: scale(80),
    borderColor: color.TitleActive,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: scale(5),
  },
  inputText: {
    width: '95%',
    color: color.TitleActive,
    fontSize: scale(15),
    paddingBottom: scale(5),
    alignSelf: 'center',
    fontFamily: FONT_FAMILY.Regular,
  },
  introTextBox: {
    alignSelf: 'center',
    marginTop: scale(10),
  },
  introText: {
    color: color.TitleActive,
    fontSize: scale(18),
    fontFamily: FONT_FAMILY.Regular,
    letterSpacing: 4,
  },
  address: {
    marginLeft: scale(5),
  },
  bodyTextBox: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: scale(10),
  },
  bodyText1: {
    marginTop: scale(10),
    color: color.TitleActive,
    fontSize: 16,
    marginLeft: scale(10),
    fontFamily: FONT_FAMILY.SemiBold,
  },
  bodyText: {
    color: color.TitleActive,
    fontSize: 16,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  name: {
    marginTop: scale(10),
    color: color.TitleActive,
    fontSize: 18,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  details: {
    marginLeft: scale(20),
    justifyContent: 'center',
  },
  dropdown: {
    marginHorizontal: scale(10),
    color: color.White,
    zIndex: 2,
  },
  text: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(14),
    marginLeft: scale(240),
  },
  method: {
    marginTop: scale(10),
    justifyContent: 'center',
    zIndex: 2,
  },
  totalBorder: {
    borderTopWidth: 1,
    marginHorizontal: scale(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    color: color.TitleActive,
    fontSize: 17,
    fontFamily: FONT_FAMILY.BoldSecond,
  },
  price: {
    // alignSelf: 'flex-end',
    color: color.Primary,
    fontSize: 16,
    fontFamily: FONT_FAMILY.Regular,
  },
  placeOrder: {
    marginTop: scale(15),
    width: '100%',
    height: scale(56),
    backgroundColor: color.TitleActive,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    color: color.White,
    fontSize: 16,
    fontFamily: FONT_FAMILY.Regular,
    alignSelf: 'center',
  },
  placeOrderDisable: {
    marginTop: scale(15),
    width: '100%',
    height: scale(56),
    backgroundColor: color.GraySolid,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonDisable: {
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
    alignSelf: 'center',
  },
  viewScrollOnline: {
    alignSelf: 'center',
    height: scale(250),
    marginTop: scale(10),
    zIndex: -1,
  },
  viewScrollOffline: {
    alignSelf: 'center',
    height: scale(300),
    marginTop: scale(10),
    zIndex: -1,
  },
  PlusPosition: {
    position: 'absolute',
    marginLeft: scale(300),
    justifyContent: 'center',
  },
  addShipping: {
    borderColor: color.TitleActive,
    width: scale(342),
    height: scale(48),
    borderWidth: 1,
    backgroundColor: color.OffWhite,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: scale(30),
    marginVertical: scale(20),
  },
  addShippingText: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    marginLeft: scale(20),
  },
  dropdownContainer: {
    width: '95%',
    alignSelf: 'center',
    marginTop: scale(5),
    borderRadius: 5,
  },
});
