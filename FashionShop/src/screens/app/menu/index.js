import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import useLogout from '../../../hooks/useLogout';
import {useDispatch, useSelector} from 'react-redux';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import {resetCartWhenLogOut} from '../../../redux/actions/cartActions';
import {resetUserWhenLogOut} from '../../../redux/actions/userActions';
import {resetAddressWhenLogOut} from '../../../redux/actions/addressActions';
import OKMessageBox from '../../../components/messageBox/OKMessageBox';
import Custom_MenuFooter from './components/Custom_MenuFooter';
import Custom_UnderlineButtonMenu from './components/Custom_UnderlineButtonMenu';
import scale from '../../../constants/responsive';
import FONT_FAMILY from '../../../constants/fonts';
import color from '../../../constants/color';
import {
  IC_Call,
  IC_Close,
  IC_Profile,
  IC_ForwardArrow,
  IC_Location,
  IC_Forward,
  IC_MyOrder,
} from '../../../assets/icons';

const Menu = props => {
  const [category, setCategory] = useState([]);
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const {cartId} = cart;
  console.log(cartId);
  const locationUrl =
    'https://www.google.com/maps/search/UIT/@10.824217,106.7037515,13z/data=!3m1!4b1?hl=vi-VN';
  const openUrl = async url => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(`Do not know how to open this url: ${url}`);
    }
  };
  const handleCopy = textToCopy => {
    Clipboard.setString(textToCopy);
    setVisible(true);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getCategory = async () => {
      try {
        const response = await axiosPrivate.get(`/all-categories`, {
          signal: controller.signal,
        });
        setData(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    getCategory();
    return () => {
      controller.abort();
    };
  }, []);
  useEffect(() => {
    const handleCategory = async () => {
      try {
        let parentCat = [{}];
        let newContent = [];
        parentCat = data.filter(item => !item.parentId);
        parentCat.map((item, index) => {
          const obj = {};
          obj.title = item.name;
          obj._id = item._id;
          if (index === 0) obj.isShowed = true;
          else obj.isShowed = false;
          obj.child = [];
          newContent[index] = obj;
          data.map(item => {
            if (item.parentId === newContent[index]._id)
              newContent[index].child.push(item);
          });
        });
        setCategory(newContent);
      } catch (err) {
        console.log(err);
      }
    };
    handleCategory();
  }, [data]);
  const logout = useLogout();
  const dispatch = useDispatch();

  const signOut = async () => {
    console.log(JSON.stringify(cartId));
    try {
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
      logout();
      await dispatch(resetCartWhenLogOut());
      await dispatch(resetUserWhenLogOut());
      await dispatch(resetAddressWhenLogOut());
      props.navigation.replace('AuthStackScreen');
    } catch (error) {
      console.log(error?.response?.data);
    }
  };
  const updateLayout = index => {
    const array = [...category];
    array.map((value, placeIndex) =>
      placeIndex === index
        ? (array[placeIndex]['isShowed'] = !array[placeIndex]['isShowed'])
        : (array[placeIndex]['isShowed'] = false),
    );
    setCategory(array);
  };

  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('women');
  return (
    <SafeAreaView style={styles.container}>
      <OKMessageBox
        visible={visible}
        clickCancel={() => {
          setVisible(false);
        }}
        title={'NOTIFICATION'}
        message={`Phone number was copied!`}
      />
      {/* Icon Close */}
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <IC_Close />
      </TouchableOpacity>
      <ScrollView>
        {/* Categories */}
        <ScrollView
          contentContainerStyle={{horizontal: true}}
          scrollEnabled={true}>
          <View style={styles.categoryView}>
            {category.map((item, key) => (
              <View key={item._id}>
                <Custom_UnderlineButtonMenu
                  isChoosing={tab === item.title}
                  onPress={() => [setTab(item.title), updateLayout(key)]}
                  textStyle={styles.categoryText(tab === item.title)}>
                  {item.title.toUpperCase()}
                </Custom_UnderlineButtonMenu>
              </View>
            ))}
          </View>
          {category.map((item, key) => (
            <View key={key} style={{width: '100%'}}>
              {item.child.map(
                itemChild =>
                  item.isShowed && (
                    <View style={{marginTop: scale(10)}} key={itemChild._id}>
                      <TouchableOpacity
                        style={styles.viewList}
                        activeOpacity={0.6}
                        onPress={() =>
                          props.navigation.navigate(
                            'CategoryGridViewByIdScreen',
                            {
                              data: itemChild,
                            },
                          )
                        }>
                        <View style={styles.viewTextList}>
                          <Text style={styles.textList}>
                            {itemChild.name.toUpperCase()}
                          </Text>
                        </View>
                        <View
                          style={{alignItem: 'center', alignSelf: 'center'}}>
                          <IC_Forward />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ),
              )}
            </View>
          ))}
        </ScrollView>
        {/* Buttons */}
        <TouchableOpacity
          style={styles.buttonView}
          onPress={() => props.navigation.navigate('MyInfoStackScreen')}>
          <IC_Profile />
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonView}
          onPress={() => props.navigation.navigate('OrdersScreen')}>
          <IC_MyOrder />
          <Text style={styles.buttonText}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonView}
          onPress={() => handleCopy('0912345678')}>
          <IC_Call />
          <Text style={styles.buttonText}>{'0912-345-678'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonView}
          onPress={() => {
            openUrl(locationUrl);
          }}>
          <IC_Location />
          <Text style={styles.buttonText}>Store location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonView} onPress={() => signOut()}>
          <IC_ForwardArrow />
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <Custom_MenuFooter />
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.White,
    flex: 1,
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    flexDirection: 'column',
  },
  // --------------------------- //
  viewList: {
    height: scale(50),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewTextList: {
    justifyContent: 'center',
    marginLeft: scale(20),
  },
  categoryView: {
    flexDirection: 'row',
    marginTop: scale(15),
  },
  categoryText: isChoosing => ({
    color: isChoosing ? color.Primary : color.TitleActive,
    fontSize: scale(17),
    fontFamily: FONT_FAMILY.Regular,
  }),
  textList: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(15),
    lineHeight: scale(48),
    color: color.TitleActive,
  },
  viewIcon: {
    alignSelf: 'center',
  },
  hidden: {
    height: 0,
  },
  list: {
    overflow: 'hidden',
  },
  viewListBody: {
    height: scale(50),
    width: '100%',
    flexDirection: 'row',
    opacity: 30,
  },
  textListBody: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    lineHeight: scale(46),
    color: color.TitleActive,
    marginLeft: scale(30),
  },
  // --------------------------- //
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(16),
    marginTop: scale(10),
  },
  buttonText: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
    lineHeight: scale(34),
    letterSpacing: scale(0.8),
    color: color.TitleActive,
    marginLeft: scale(16),
  },
});
