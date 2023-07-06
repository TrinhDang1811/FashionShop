import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';
import {IC_Plus, IC_Edit, IC_CartDelete} from '../../../../assets/icons';
import {LineBottom} from '../../../../components/footer/images';
import {
  editAddress,
  removeAddress,
} from '../../../../redux/actions/addressActions';

const ListOfAddressesScreen = props => {
  const {prevScreen} = props.route.params;
  console.log(props.route);
  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;
  const address = useSelector(state => state.address);
  const [addresses, setAddresses] = useState(address.addresses);
  const {addressesId} = address;
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const removeAddressHandler = async _id => {
    try {
      const afterDeleteAddresses = addresses.filter(item => item._id !== _id);
      dispatch(removeAddress(_id));
      setAddresses(afterDeleteAddresses);
      const response = await axiosPrivate.put(
        `/edit-addresses/${addressesId}`,
        JSON.stringify({
          addresses: afterDeleteAddresses,
        }),
      );
      console.log('success: ', JSON.stringify(response?.data));
    } catch (err) {
      console.log(err);
    }
  };
  const handleEditAddressDefault = async _id => {
    try {
      const addressEdit = addresses.filter(item => item._id === _id);
      addressEdit[0] = {...addressEdit[0], isDefault: true};
      const defaultAddress = addresses.filter(item => item.isDefault === true);
      defaultAddress[0] = {...defaultAddress[0], isDefault: false};
      const afterEditAddresses = addresses.map(item =>
        item._id === _id ? addressEdit[0] : item,
      );
      const afterEditAddressesDefault = afterEditAddresses.map(item =>
        item._id === defaultAddress[0]._id ? defaultAddress[0] : item,
      );
      dispatch(editAddress(afterEditAddresses));
      console.log({addresses});
      const response = await axiosPrivate.put(
        `/edit-addresses/${addressesId}`,
        JSON.stringify({
          addresses: afterEditAddressesDefault,
        }),
      );
      console.log('success', JSON.stringify(response.data));
      // if (prevScreen === 'infoScreen')
      //   props.navigation.navigate('CheckOutScreen');
      // props.navigation.navigate('CheckOutScreen');
      props.navigation.goBack();
      //setLoading(false);
    } catch (error) {
      //setLoading(false);
      console.log('error', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          paddingHorizontal: scale(10),
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '400',
            fontFamily: FONT_FAMILY.Regular,
            letterSpacing: 4,
            textAlign: 'center',
            color: color.TitleActive,
            marginTop: scale(20),
          }}>
          LIST OF ADDRESSES
        </Text>
        <Image
          source={LineBottom}
          style={{alignSelf: 'center', marginBottom: scale(20)}}
        />
      </View>
      <ScrollView horizontal={false}>
        {addresses.map(item => (
          <TouchableOpacity
            style={styles.bodyTextBox}
            key={item._id}
            onPress={() => handleEditAddressDefault(item._id)}>
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
            <View
              style={{
                flexDirection: 'column',
                height: scale(90),
                justifyContent: 'space-between',
                marginTop: scale(20),
                marginLeft: scale(30),
              }}>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('EditAddressScreen', {
                    data: item,
                  })
                }>
                <IC_Edit />
              </TouchableOpacity>
              <TouchableOpacity
                style={{height: scale(30)}}
                onPress={() => removeAddressHandler(item._id)}>
                <IC_CartDelete stroke={color.TitleActive} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addShipping}
        onPress={() => props.navigation.navigate('AddNewAddressScreen')}>
        <Text style={styles.addShippingText}>ADD SHIPPING ADDRESS</Text>
        <IC_Plus style={styles.PlusPosition} stroke={color.OffWhite} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ListOfAddressesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  bodyTextBox: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    width: '100%',
    paddingHorizontal: scale(10),
  },
  name: {
    marginTop: scale(10),
    color: color.TitleActive,
    fontSize: 18,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  bodyText: {
    marginTop: scale(10),
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  PlusPosition: {
    position: 'absolute',
    marginLeft: scale(300),
    justifyContent: 'center',
  },
  addShipping: {
    borderColor: color.White,
    width: scale(342),
    height: scale(48),
    backgroundColor: color.TitleActive,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: scale(30),
    marginVertical: scale(20),
  },
  addShippingText: {
    color: color.OffWhite,
    fontFamily: FONT_FAMILY.RegularForAddress,
    fontSize: scale(16),
    fontWeight: 400,
    marginLeft: scale(20),
  },
});
