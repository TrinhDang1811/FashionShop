import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import SaveButton from '../../../../components/buttons/Save';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';
import {
  IC_BackwardArrow,
  IC_Address,
  IC_Phone,
  IC_Email,
} from '../../../../assets/icons';

const MyInfoScreen = props => {
  const [showPassword, setShowPassword] = useState(false);
  const [addressDefault, setAddressDefault] = useState([]);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isFocus = useIsFocused();
  useEffect(() => {
    // if (typeof addresses !== 'object' && addresses !== null)
    addresses !== null &&
      setAddressDefault(addresses?.filter(item => item.isDefault === true));
  }, [isFocus]);
  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;

  const {addresses} = useSelector(state => state.address);
  // const [addresses, setAddresses] = useState(address.addresses);
  console.log({addresses});

  const navigateAddAddress = () => {
    props.navigation.navigate('CheckOutStackScreen', {
      screen: 'ListOfAddressesScreen',
      params: {
        prevScreen: 'infoScreen',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.viewIcon}
            onPress={() => props.navigation.goBack()}>
            <IC_BackwardArrow />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Image
              source={{uri: userInfo.avatarImage}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.inputName}>
            <View style={styles.inputFirstName}>
              <Text style={styles.inputName1}>{userInfo.firstName}</Text>
            </View>

            <View style={styles.inputLastName}>
              <Text style={styles.inputName1}>{userInfo.lastName}</Text>
            </View>
          </View>
          {/* mail */}
          <View style={styles.inputBox}>
            <View style={styles.icon}>
              <IC_Email />
              <Text style={styles.inputText}>{userInfo.email}</Text>
            </View>
          </View>
          {/* phone number */}
          <View style={styles.inputBox}>
            <View style={styles.icon}>
              <IC_Phone />
              <Text style={styles.inputText}>{userInfo.phoneNumber}</Text>
            </View>
          </View>
          {/* address */}
          <TouchableOpacity
            style={styles.inputBox}
            onPress={navigateAddAddress}>
            <View style={styles.icon}>
              <IC_Address />
              <Text style={styles.inputText}>
                {addressDefault[0]
                  ? addressDefault[0].streetAndNumber +
                    ',' +
                    addressDefault[0].ward +
                    ',' +
                    addressDefault[0].district +
                    ',' +
                    addressDefault[0].city
                  : 'No address yet, please add one'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.buttonSignIn}>
        <SaveButton
          text={'Edit Profile'}
          onPress={() =>
            props.navigation.navigate('EditMyInfoScreen', {
              userInfo: userInfo,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MyInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  header: {
    flex: 0.3,
    backgroundColor: color.TitleActive,
  },
  viewIcon: {
    marginLeft: scale(26),
    width: scale(40),
    height: scale(30),
    marginTop: scale(22),
    alignItems: 'center',
  },
  avatar: {
    top: scale(50),
    alignSelf: 'center',
    width: scale(150),
    height: scale(150),
    backgroundColor: 'purple',
    borderRadius: 1000,
    overflow: 'hidden',
  },
  body: {
    marginTop: scale(30),
    flex: 0.7,
    alignItems: 'center',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
    width: scale(280),
  },
  icon1: {
    marginTop: scale(30),
    marginLeft: scale(5),
  },

  inputName: {
    flexDirection: 'row',
    marginTop: scale(30),
    width: scale(295),
    justifyContent: 'space-between',
  },
  inputFirstName: {
    borderBottomWidth: 1,
    width: '35%',
  },
  inputLastName: {
    borderBottomWidth: 1,
    width: '60%',
  },
  inputBox: {
    marginTop: scale(40),
    width: scale(295),
    borderColor: color.GraySolid,
    borderBottomWidth: 1,
  },
  inputName1: {
    color: color.TitleActive,
    fontSize: 16,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  inputText: {
    color: color.TitleActive,
    fontSize: 16,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  inputText2: {
    color: color.TitleActive,
    fontSize: 16,
    fontFamily: FONT_FAMILY.RegularForAddress,
  },

  buttonSignIn: {
    marginBottom: scale(0),
    alignSelf: 'center',
  },
});
