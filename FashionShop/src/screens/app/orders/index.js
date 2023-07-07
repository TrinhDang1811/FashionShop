import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import scale from '../../../constants/responsive';
import color from '../../../constants/color';
import PriceAttribute from './components/priceAttribute';
import ButtonReOrder from './components/buttonOrder';
import FONT_FAMILY from '../../../constants/fonts';
import {
  IC_Cancel,
  IC_New,
  IC_Delivered,
  IC_Delivering,
  IC_Preparing,
} from '../../../assets/icons';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import ButtonOrder from './components/buttonOrder';
import {reOrder} from '../../../redux/actions/cartActions';

const {width: screenWidth} = Dimensions.get('window');

const OrdersScreen = props => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [chosen, setChosen] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetOrder().then(() => setRefreshing(false));
  }, []);
  const handleGetOrder = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/get-order-by-userId/${userInfo._id}`,
      );
      setOrders(response?.data.orders);
      setChosen('new');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      handleGetOrder();
    });
    return unsubscribe;
  }, [props.navigation]);

  const ReOrder = cart => {
    dispatch(reOrder(cart));
    props.navigation.navigate('CartScreen');
  };

  const cancelHandler = async id => {
    try {
      const response = await axiosPrivate.put(`/cancel-order/${id}`);
      console.log('cancelOrder', JSON.stringify(response.data));
      handleGetOrder();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const filters = orders => {
    const newData = orders.filter(x => x.orderStatus === chosen);
    setFilteredOrders([...newData.reverse()]);
    // console.log({filteredOrders});
    return filteredOrders;
  };

  useEffect(() => {
    if (orders) filters(orders);
  }, [chosen]);

  return loading ? (
    <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
      <ActivityIndicator color={color.Primary} size={60} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal="false"
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.scroll}>
          <View style={styles.viewData}>
            {filteredOrders.map(data => (
              <View key={data._id}>
                <View style={{flexDirection: 'row', width: '100%'}}>
                  <Image
                    style={styles.imgData}
                    source={{
                      uri: `${data.productDetails[0].productDetailId.productId.posterImage.url}`,
                    }}
                    resizeMode="cover"
                  />
                  {/* <View style={{flex}}> */}
                  <View
                    style={{
                      alignSelf: 'center',
                      marginLeft: scale(15),
                      width: '70%',
                    }}>
                    <Text style={styles.info} numberOfLines={1}>
                      Receiver: {userInfo.firstName + ' ' + userInfo.lastName}
                    </Text>
                    <Text style={styles.info} numberOfLines={1}>
                      Phone Number: {userInfo.phoneNumber}
                    </Text>
                    {data.note === '' ? null : (
                      <Text style={styles.info} numberOfLines={1}>
                        Note: {data.note}
                      </Text>
                    )}
                    {data.address === undefined ? (
                      <View style={{flexDirection: 'column'}}>
                        <Text style={styles.info} numberOfLines={1}>
                          Shop's location: University Of Information Technology
                        </Text>
                        <Text style={styles.info} numberOfLines={1}>
                          Contact number: (786) 713-8616
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.info} numberOfLines={2}>
                        Location:{' '}
                        {data.address.streetAndNumber +
                          ', ' +
                          data.address.ward +
                          ', ' +
                          data.address.district +
                          ', ' +
                          data.address.city}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{marginTop: scale(10)}}>
                  {data.productDetails.map(item => (
                      <PriceAttribute
                        onPress={() => {
                          props.navigation.navigate('ProductStackScreen', {
                            screen: 'ProductDetailsScreen',
                            params: {data: item.productDetailId.productId},
                          })
                        }}
                        ratingData={chosen === 'complete' ? item : null}
                        isRated={item.rated}
                        onPressRating={() => {
                          props.navigation.navigate('ProductReviewScreen', {
                            data: {orderId: data._id, detail: item},
                          });
                        }}
                        key={item._id}
                        image={item.productDetailId.productId.posterImage.url}
                        qty={item.quantity}
                        name={item.productDetailId.productId.name}
                        price={item.productDetailId.productId.price}
                        sizeName={item.productDetailId.sizeId.name}
                        colorCode={item.productDetailId.colorId.code}
                      />
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    top: 10,
                    borderBottomWidth: 0.2,
                    paddingBottom: scale(10),
                  }}>
                  <View style={styles.viewTotal}>
                    <Text style={styles.textTotal}>
                      Total: ${data.orderTotalPrice}
                    </Text>
                  </View>
                  {chosen === 'new' || chosen === 'in progress' ? (
                    <ButtonOrder
                      onPress={() => cancelHandler(data._id)}
                      title={'CANCEL'}
                    />
                  ) : chosen === 'complete' ? (
                      <ButtonOrder
                        onPress={() => ReOrder(data.productDetails)}
                        title={'RE_ORDER'}
                      />
                  ) : chosen === 'cancel' ? (
                    <ButtonOrder
                      onPress={() => ReOrder(data.productDetails)}
                      title={'RE_ORDER'}
                    />
                  ) : null}
                </View>
                <View style={{height: scale(50)}} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Nav Bar */}
      <>
        <View style={styles.bottomTabs}>
          <TouchableOpacity
            style={chosen == 'new' ? styles.touchTabChosen : styles.touchTab}
            onPress={() => {
              setChosen('new');
            }}>
            <View
              style={{
                width: scale(24),
                height: scale(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IC_New
                fill={chosen == 'new' ? color.TitleActive : color.OffWhite}
                stroke={chosen == 'new' ? color.OffWhite : color.TitleActive}
              />
            </View>
            <Text
              style={chosen == 'new' ? styles.textTabChosen : styles.textTab}>
              New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              chosen == 'in progress' ? styles.touchTabChosen : styles.touchTab
            }
            onPress={() => {
              setChosen('in progress');
            }}>
            <View
              style={{
                width: scale(24),
                height: scale(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IC_Preparing
                fill={
                  chosen == 'in progress' ? color.TitleActive : color.OffWhite
                }
                stroke={
                  chosen == 'in progress' ? color.OffWhite : color.TitleActive
                }
              />
            </View>
            <Text
              style={
                chosen == 'in progress' ? styles.textTabChosen : styles.textTab
              }>
              In Progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              chosen == 'shipping' ? styles.touchTabChosen : styles.touchTab
            }
            onPress={() => {
              setChosen('shipping');
            }}>
            <View
              style={{
                width: scale(24),
                height: scale(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IC_Delivering
                fill={chosen == 'shipping' ? color.TitleActive : color.OffWhite}
                stroke={
                  chosen == 'shipping' ? color.OffWhite : color.TitleActive
                }
              />
            </View>
            <Text
              style={
                chosen == 'shipping' ? styles.textTabChosen : styles.textTab
              }>
              Shipping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              chosen == 'complete' ? styles.touchTabChosen : styles.touchTab
            }
            onPress={() => {
              setChosen('complete');
            }}>
            <View
              style={{
                width: scale(24),
                height: scale(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IC_Delivered
                fill={chosen == 'complete' ? color.TitleActive : color.OffWhite}
                stroke={
                  chosen == 'complete' ? color.OffWhite : color.TitleActive
                }
              />
            </View>
            <Text
              style={
                chosen == 'complete' ? styles.textTabChosen : styles.textTab
              }>
              Complete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={chosen == 'cancel' ? styles.touchTabChosen : styles.touchTab}
            onPress={() => {
              setChosen('cancel');
            }}>
            <View
              style={{
                width: scale(24),
                height: scale(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IC_Cancel
                fill={chosen == 'cancel' ? color.TitleActive : color.OffWhite}
                stroke={chosen == 'cancel' ? color.OffWhite : color.TitleActive}
              />
            </View>
            <Text
              style={
                chosen == 'cancel' ? styles.textTabChosen : styles.textTab
              }>
              Canceled
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.White,
    flex: 1,
  },
  scroll: {
    width: screenWidth,
  },
  scrollView: {
    width: screenWidth,
    marginTop: 20,
  },
  viewData: {
    alignSelf: 'center',
    width: scale(347),
  },

  imgData: {
    width: '25%',
    height: scale(87),
    opacity: 0.65,
    backgroundColor: color.TitleActive,
  },
  viewTotal: {
    justifyContent: 'center',
  },
  textTotal: {
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: 14,
    color: color.RedSolid,
  },
  bottomTabs: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'space-between',
    bottom: 0,
    backgroundColor: color.White,
  },
  textTab: {
    marginTop: scale(5),
    color: color.TitleActive,
    fontSize: scale(14),
    fontFamily: FONT_FAMILY.Regular,
  },
  textTabChosen: {
    marginTop: scale(5),
    color: color.OffWhite,
    fontSize: scale(14),
    fontFamily: FONT_FAMILY.Regular,
  },
  touchTab: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.White,
    paddingVertical: scale(5),
  },
  touchTabChosen: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(5),
    backgroundColor: color.TitleActive,
  },
  info: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.RegularForAddress,
    fontSize: scale(14),
  },
});
