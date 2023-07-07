import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useRef} from 'react';
import useLogout from '../../../hooks/useLogout';
import {useDispatch} from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import {axiosPrivate} from '../../../apis/axios';
import {Controller, useForm} from 'react-hook-form';

import {resetCartWhenLogOut} from '../../../redux/actions/cartActions';
import {
  resetUserWhenLogOut,
  userVerified,
} from '../../../redux/actions/userActions';

import SaveButton from '../../../components/buttons/Save';
import scale from '../../../constants/responsive';
import FONT_FAMILY from '../../../constants/fonts';
import color from '../../../constants/color';
import {IC_BackwardArrow} from '../../../assets/icons';

const OTPScreen = props => {
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState('');
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const logout = useLogout();
  const dispatch = useDispatch();
  const {auth, setAuth} = useAuth();
  const signOut = async () => {
    try {
      logout();
      dispatch(resetCartWhenLogOut());
      dispatch(resetUserWhenLogOut());
      props.navigation.replace('AuthStackScreen');
    } catch (error) {
      console.log(error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      otp: '',
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      userId: auth.userId,
    },
  });
  const handleVerified = async () => {
    try {
      const response = await axiosPrivate.post(
        '/verify-email',
        JSON.stringify({otp: otp1 + otp2 + otp3 + otp4, userId: auth.userId}),
      );
      console.log('success', JSON.stringify(response.data));
      if (response?.status === 200) {
        setAuth(prev => {
          return {...prev, _id: auth.userId, emailVerified: true};
        });
        dispatch(userVerified(true));
      }
    } catch (err) {
      console.log('err', err);
      console.log(JSON.stringify(otp));
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss() && TextInput.clearFocus()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.viewIcon} onPress={() => signOut()}>
            <IC_BackwardArrow stroke={color.White} />
          </TouchableOpacity>

          <View style={styles.ViewTitleText}>
            <Text style={styles.textTile}>Enter OTP</Text>
            <Text numberOfLines={2} style={styles.textLabel}>
              Please enter verification code sent to your email
            </Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.otpContainer}>
            <Controller
              name="otp1"
              control={control}
              render={({field: {onChange, value}}) => (
                <View style={styles.otpBox}>
                  <TextInput
                    style={styles.otpText}
                    keyboardType="ascii-capable-number-pad"
                    maxLength={1}
                    ref={firstInput}
                    value={value}
                    onChangeText={text => {
                      [onChange(text), setOtp1(text)];
                      text && secondInput.current.focus();
                    }}
                  />
                </View>
              )}
            />
            <Controller
              name="otp2"
              control={control}
              render={({field: {onChange, value}}) => (
                <View style={styles.otpBox}>
                  <TextInput
                    style={styles.otpText}
                    keyboardType="ascii-capable-number-pad"
                    maxLength={1}
                    ref={secondInput}
                    value={value}
                    onChangeText={text => {
                      [onChange(text), setOtp2(text)];
                      text
                        ? thirdInput.current.focus()
                        : firstInput.current.focus();
                    }}
                  />
                </View>
              )}
            />
            <Controller
              name="otp3"
              control={control}
              render={({field: {onChange, value}}) => (
                <View style={styles.otpBox}>
                  <TextInput
                    style={styles.otpText}
                    keyboardType="ascii-capable-number-pad"
                    maxLength={1}
                    ref={thirdInput}
                    value={value}
                    onChangeText={text => {
                      [onChange(text), setOtp3(text)];
                      text
                        ? fourthInput.current.focus()
                        : secondInput.current.focus();
                    }}
                  />
                </View>
              )}
            />
            <Controller
              name="otp4"
              control={control}
              render={({field: {onChange, value}}) => (
                <View style={styles.otpBox}>
                  <TextInput
                    style={styles.otpText}
                    keyboardType="ascii-capable-number-pad"
                    maxLength={1}
                    ref={fourthInput}
                    value={value}
                    onChangeText={text => {
                      [onChange(text), setOtp4(text)];
                      !text && fourthInput.current.focus();
                    }}
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.buttonVerification}>
            <SaveButton
              text={'Verify'}
              onPress={handleSubmit(handleVerified)}
            />
          </View>
          <View style={styles.checkVerification}>
            <Text style={styles.question}>Did not get an OTP code?</Text>
            <TouchableOpacity>
              <Text style={styles.resendOTP}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.Background,
  },
  header: {
    flex: 0.3,
    backgroundColor: color.TitleActive,
  },
  viewIcon: {
    marginLeft: scale(30),
    width: scale(40),
    height: scale(30),
    marginTop: scale(23),
    alignItems: 'center',
  },
  ViewTitleText: {
    marginTop: scale(10),
    marginLeft: scale(30),
  },
  textTile: {
    color: color.White,
    fontSize: 36,
    fontFamily: FONT_FAMILY.JoseFinSans,
    fontWeight: 700,
  },
  textLabel: {
    color: color.White,
    fontSize: 18,
    fontFamily: FONT_FAMILY.JoseFinSans,
    fontWeight: 500,
    width: scale(250),
  },
  body: {
    flex: 0.7,
    backgroundColor: color.White,
    alignItems: 'center',
  },
  otpContainer: {
    marginTop: scale(91),
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    borderColor: color.GraySolid,
    borderWidth: scale(1),
    width: scale(45),
    height: scale(50),
    marginHorizontal: scale(5),
  },
  otpText: {
    fontSize: scale(25),
    color: color.Black,
    textAlign: 'center',
  },
  buttonVerification: {
    marginTop: scale(90),
  },
  textFailed: {
    paddingLeft: scale(25),
    paddingTop: scale(17),
    justifyContent: 'center',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(12),
    color: color.Red,
  },
  checkVerification: {
    marginVertical: scale(20),
    color: color.GraySolid,
    fontSize: 18,
    fontFamily: FONT_FAMILY.JoseFinSans,
    fontWeight: 200,
    alignItems: 'center',
  },
});
