import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import scale from '../../constants/responsive';
import {IC_Menu, IC_Search, IC_ShoppingBagHeader} from '../../assets/icons';
import {IC_Logo} from '../logo';

const Custom_Header = ({
  logoColor,
  menuColor,
  searchColor,
  cartColor,
  navigation,
}) => {
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  const numberOfProduct = cartItems?.length || 0;
  return (
    <View style={styles.container}>
      {/* Menu */}
      <TouchableOpacity
        style={styles.menuContainer}
        onPress={() => navigation.navigate('MenuScreen')}>
        <IC_Menu fill={menuColor} />
      </TouchableOpacity>
      {/* Logo */}
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => navigation.navigate('HomeScreen')}>
        <IC_Logo fill={logoColor} />
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        {/* Search */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate('SearchDetailScreen')}>
          <IC_Search stroke={searchColor} />
        </TouchableOpacity>
        {/* ShoppingBag */}
        <TouchableOpacity
          style={styles.shoppingBagContainer}
          onPress={() => navigation.navigate('CartScreen')}>
          <IC_ShoppingBagHeader
            strokeA={cartColor}
            strokeB={cartColor}
            nOP={numberOfProduct}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Custom_Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '95%',
    position: 'relative',
    alignItems: 'center',
  },
  menuContainer: {},
  logoContainer: {
    paddingLeft: scale(50),
    //width: scale(100),
  },
  searchContainer: {},
  shoppingBagContainer: {
    marginLeft: scale(20),
  },
});
