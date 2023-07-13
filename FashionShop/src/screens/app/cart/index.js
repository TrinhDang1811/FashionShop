import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeFromCart,
  adjustQTY,
  order,
  orderAll,
} from '../../../redux/actions/cartActions';
import scale from '../../../constants/responsive';
import FONT_FAMILY from '../../../constants/fonts';
import Custom_Cart from '../../../components/cart/Custom_Cart';
import Button from './components/button';
import OKMessageBox from '../../../components/messageBox/OKMessageBox';
import color from '../../../constants/color';
import {IC_Close} from '../../../assets/icons';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

const CartScreen = props => {
  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [notExistOrder, setNotExistOrder] = useState(false);
  const [notExistCart, setNotExistCart] = useState(false);
  const [isOrder, setIsOrder] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const {cartId} = cart;

  const checkOutCart = cartItems.filter(item => item.isOrder === true);
  console.log({checkOutCart});
  useEffect(() => {
    onCalculateAmount();

    if (cartItems.length === 0) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [checkOutCart, cartItems, totalAmount]);

  const onCalculateAmount = () => {
    let total = 0;
    if (Array.isArray(cartItems) && Array.isArray(checkOutCart)) {
      checkOutCart.map(item => {
        total += item.product.price * item.qty;
      });
    }
    setTotalAmount(total);
  };
  const buyNowHandler = async () => {
    try {
      console.log({cartId})
      const editCart = [];
      cartItems.map(item => {
        const editCartItem = {
          productDetailId: item.detailId,
          quantity: item.qty,
        };
        editCart.push(editCartItem);
      });
      const response = await axiosPrivate.put(
        `/edit-cart-item/${cartId}`,
        JSON.stringify({
          productDetails: editCart,
        }),
      );
      console.log('editCartSuccess', JSON.stringify(response.data));
      props.navigation.navigate('CheckOutStackScreen');
    } catch (error) {
      console.log('Error', JSON.stringify(error?.response?.data));
    }
  };

  const qtyChangeHandler = (id, qty) => {
    dispatch(adjustQTY(id, qty));
  };

  const removeFromCartHandler = id => {
    dispatch(removeFromCart(id));
  };
  const orderHandler = (id, isOrder) => {
    dispatch(order(id, isOrder));
  };
  const orderAllHandler = () => {
    dispatch(orderAll());
    setIsOrder(!isOrder);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OKMessageBox
        visible={notExistOrder}
        clickCancel={() => {
          setNotExistOrder(false);
        }}
        title={'NO ORDERS YET'}
        message={'You need to click on the box to select the item to order!'}
      />
      <OKMessageBox
        visible={notExistCart}
        clickCancel={() => {
          setNotExistCart(false);
          props.navigation.goBack();
        }}
        title={'NO CART ITEMS YET'}
        message={'You need add items to cart!'}
      />
      {/* Icon Close */}
      <TouchableOpacity
        style={{marginLeft: scale(16), marginTop: scale(5)}}
        onPress={() => props.navigation.goBack()}>
        <IC_Close />
      </TouchableOpacity>
      <View
        style={{
          marginLeft: scale(16),
          marginTop: scale(7),
          flexDirection: 'row',
        }}>
        <Text style={styles.cartText}>CART</Text>
      </View>
      {visible ? (
        <View style={{flexDirection: 'column', height: '84%'}}>
          {/* Cart Items */}
          <View style={styles.viewScroll}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cartItems.map(item => (
                <View key={item.detailId}>
                  <Custom_Cart
                    onPress={() =>
                      props.navigation.replace('ProductStackScreen', {
                        screen: 'ProductDetailsScreen',
                        params: {data: item.product},
                      })
                    }
                    quantity={item.quantity}
                    id={item.detailId}
                    isOrder={item.isOrder}
                    qty={item.qty}
                    name={item.product.name}
                    colorCode={item.colorCode}
                    sizeName={item.sizeName}
                    description={item.product.description}
                    price={item.product.price}
                    img={item.product.posterImage.url}
                    orderHandler={orderHandler}
                    qtyChangeHandler={qtyChangeHandler}
                    removeHandler={removeFromCartHandler}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          <View>
            {/* Line */}
            <View
              style={{
                marginHorizontal: scale(16),
                width: '95%',
                height: scale(1),
                backgroundColor: color.Label,
                // marginTop: scale(50),
              }}
            />
            {/* Sub Total */}
            <View
              style={{
                marginHorizontal: scale(16),
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(20),
              }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.Regular,
                  color: color.TitleActive,
                  fontSize: scale(16),
                  lineHeight: scale(18),
                }}>
                SUB TOTAL
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.Regular,
                  color: color.Secondary,
                  fontSize: scale(16),
                  lineHeight: scale(18),
                }}>
                ${totalAmount}
              </Text>
            </View>
            {/* Payment description */}
            <View
              style={{
                marginLeft: scale(16),
                width: '90%',
                marginTop: scale(20),
              }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.Regular,
                  color: color.Label,
                  fontSize: scale(14),
                  lineHeight: scale(16),
                  letterSpacing: scale(1),
                }}>
                {
                  '*shipping charges, taxes and discount codes are calculated at the time of accounting.'
                }
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            height: '70%',
            marginTop: scale(20),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.BoldSecond,
              color: color.Label,
              fontSize: scale(16),
              lineHeight: scale(18),
              letterSpacing: scale(1),
            }}>
            {'You have no items in your Shopping Bag!'}
          </Text>
        </View>
      )}
      {/* Button */}
      <Button
        text={cartItems.length !== 0 ? 'BUY NOW' : 'CONTINUE SHOPPING'}
        onPress={() => {
          if(cartItems.length === 0)
          { 
            setNotExistCart(true) 
          }
          else{ 
            if(checkOutCart.length !== 0)
            { 
              buyNowHandler()
            }
          else {
            setNotExistOrder(true)
          }}
        }}
      />
    </SafeAreaView>
  );
};
export default CartScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.White,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cartText: {
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: scale(18),
    color: color.TitleActive,
    lineHeight: scale(22),
    letterSpacing: scale(2),
    marginRight: scale(160),
  },
  selectAllText: {
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: scale(18),
    color: color.TitleActive,
    lineHeight: scale(22),
    letterSpacing: scale(2),
    marginLeft: scale(10),
  },
  viewScroll: {
    alignSelf: 'center',
    marginTop: scale(10),
    marginLeft: scale(7),
    flex: 1,
  },
});
