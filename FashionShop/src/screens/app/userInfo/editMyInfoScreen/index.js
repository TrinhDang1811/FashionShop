import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Button,
} from 'react-native';
import React from 'react';
import color from '../../../../constants/color';
import FONT_FAMILY from '../../../../constants/fonts';
import scale from '../../../../constants/responsive';
import {
  IC_BackwardArrow,
  IC_Address,
  IC_Phone,
  IC_Email,
  IC_Password,
  IC_Edit,
} from '../../../../assets/icons';
import {Avatar, Title, Caption} from 'react-native-paper';
import {useState, useEffect} from 'react';
import SaveButton from '../../../../components/buttons/Save';
import {ScrollView} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import Popup from './component/popup';
import Modal from 'react-native-modal';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import OKMessageBox from '../../../../components/messageBox/OKMessageBox';
import {useDispatch, useSelector} from 'react-redux';
import {initUser} from '../../../../redux/actions/userActions';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const signUpPayloadSchema = yup.object({
  firstName: yup
    .string()
    .max(30, 'Invalid name')
    .required('Name cannot be blank'),
  lastName: yup
    .string()
    .max(30, 'Invalid name')
    .required('Name cannot be blank'),
  // email: yup
  //   .string()
  //   .email('Invalid email')
  //   .max(50, 'Email length must be less than 50 characters')
  //   .required('Email cannot be blank'),
  phoneNumber: yup
    .string()
    .min(10, 'Invalid phone number')
    .max(11, 'Invalid phone number')
    .matches(phoneRegExp, 'Invalid phone number'),
  // password: yup
  //   .string()
  //   .matches(
  //     passwordRegex,
  //     'Password must contain uppercase, lowercase and number characters',
  //   )
  //   .min(8, 'Password length must be more than 8 characters')
  //   .max(16, 'Password length must be less than 16 characters')
  //   .required('Password can not be blank'),
  // passwordConfirm: yup
  //   .string()
  //   .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const EditMyInfoScreen = props => {
  const axiosPrivate = useAxiosPrivate();
  const oldUserInfo = props.route.params.userInfo;
  console.log({oldUserInfo});
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [passConfirm, setPassConfirm] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhoneNumber] = useState(oldUserInfo.phoneNumber);
  const [firstName, setFirstName] = useState(oldUserInfo.firstName);
  const [lastName, setLastName] = useState(oldUserInfo.lastName);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [visible, setVisible] = useState(false);
  const [visibleAvatar, setVisibleAvatar] = useState(false);
  const [image, setImage] = useState(oldUserInfo.avatarImage);
  const handleEditingPassword = () => {
    setEditingPassword(!editingPassword);
    setPassConfirm('');
  };

  let options = {
    savePhotos: true,
    mediaType: 'photo',
  };

  const openGallery = async () => {
    const result = await launchImageLibrary(options);
    setImage(result.assets[0].uri);
    setVisibleAvatar(false);
  };
  const openCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options);
      setImage(result.assets[0].uri);
      console.log({image})
      setVisibleAvatar(false);
    }
  };

  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phoneNumber: userInfo.phoneNumber,
      // password: '',
      // passwordConfirm: '',
    },
    resolver: yupResolver(signUpPayloadSchema),
  });

  async function handleSubmits() {
    const id = oldUserInfo._id;
    setLoading(true);
    const formData = new FormData();
    formData.append('avatarImage', {
      name: new Date() + '_avatarImage',
      uri: image,
      type: 'image/jpg',
    });
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phone);
    // formData.append('password', pass);

    console.log(formData);
    console.log({userInfo});
    try {
      const response = await axiosPrivate.post(`/user/${id}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('success', JSON.stringify(response.data));
      setTitle('Success');
      setMessage(`Update profile successful`);
      console.log(message);
      dispatch(initUser(response.data.user));
      setLoading(false);
    } catch (err) {
      console.log('err', err.response.data);
      setTitle('Error');
      setMessage(err.response.data.error);
      setLoading(false);
    } finally {
      setVisible(true);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.viewIcon}
            onPress={() => props.navigation.goBack()}>
            <IC_BackwardArrow />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => setVisibleAvatar(true)}>
            <Avatar.Image source={{uri: image}} size={150} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.inputName}>
            <Controller
              name="firstName"
              control={control}
              render={({field: {onChange, value}}) => (
                <View>
                  <View style={styles.inputFirstName}>
                    <View style={styles.viewInput}>
                      <TextInput
                        defaultValue={userInfo.firstName}
                        onChangeText={firstName => [
                          onChange(firstName),
                          setFirstName(firstName),
                        ]}
                        // placeholder={userInfo.firstName}
                        value={value}
                        placeholderTextColor={color.GraySolid}
                        style={styles.inputText}
                        keyboardType="default"
                      />
                    </View>
                  </View>
                  {errors?.firstName && (
                    <Text style={styles.textFailed}>
                      {errors.firstName.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({field: {onChange, value}}) => (
                <View>
                  <View style={styles.inputLastName}>
                    <View style={styles.viewInput}>
                      <TextInput
                        defaultValue={userInfo.lastName}
                        onChangeText={lastName => [
                          onChange(lastName),
                          setLastName(lastName),
                        ]}
                        // placeholder={userInfo.lastName}
                        value={value}
                        placeholderTextColor={color.GraySolid}
                        style={styles.inputText}
                        keyboardType="default"
                      />
                    </View>
                  </View>
                  {errors?.lastName && (
                    <Text style={styles.textFailed}>
                      {errors.lastName.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
          {/* <Controller
            name="password"
            control={control}
            render={({field: {onChange, value}}) => (
              <View>
                <View style={styles.inputBox}>
                  <View style={styles.icon}>
                    <TouchableOpacity onPress={handleShowPassword}>
                      <IC_Password />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.viewInput}>
                    <TextInput
                      secureTextEntry={!showPassword}
                      onChangeText={password => [
                        onChange(password),
                        setPassword(password),
                      ]}
                      onFocus={handleEditingPassword}
                      value={value}
                      placeholder="Enter password"
                      placeholderTextColor={color.GraySolid}
                      style={styles.inputText}
                    />
                  </View>
                </View>
                {errors?.password && (
                  <Text style={styles.textFailedPass}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          /> */}
          {editingPassword ? (
            <Controller
              name="passwordConfirm"
              control={control}
              render={({field: {onChange, value}}) => (
                <View>
                  <View style={styles.inputBox}>
                    <View style={styles.viewInput}>
                      <TextInput
                        secureTextEntry={!showPassword}
                        onChangeText={passConfirm => [
                          onChange(passConfirm),
                          setPassConfirm(password),
                        ]}
                        value={value}
                        placeholder="Confirm password"
                        placeholderTextColor={color.GraySolid}
                        style={styles.inputText}
                      />
                    </View>
                  </View>
                  {errors?.passwordConfirm && (
                    <Text style={styles.textFailedPass}>
                      {errors.passwordConfirm.message}
                    </Text>
                  )}
                </View>
              )}
            />
          ) : null}

          {/* phone number */}
          <Controller
            name="phoneNumber"
            control={control}
            render={({field: {onChange, value}}) => (
              <View>
                <View style={styles.inputBox}>
                  <View style={styles.icon1}>
                    <IC_Phone style={styles.iconPhone} />
                  </View>
                  <View style={styles.viewInput}>
                    <TextInput
                      defaultValue={userInfo.phoneNumber}
                      onChangeText={phone => [
                        onChange(phone),
                        setPhoneNumber(phone),
                      ]}
                      // placeholder={userInfo.phoneNumber}
                      value={value}
                      placeholderTextColor={color.GraySolid}
                      style={styles.inputText}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                {errors?.phoneNumber && (
                  <Text style={styles.textFailed}>
                    {errors.phoneNumber.message}
                  </Text>
                )}
              </View>
            )}
          />
          <View style={styles.buttonSignIn}>
            <SaveButton
              text={'Save Edit'}
              onPress={handleSubmit(handleSubmits)}
              loading={loading}
            />
          </View>
        </View>
        <Modal
          style={styles.viewModal}
          onBackdropPress={() => setVisibleAvatar(false)}
          onBackButtonPress={() => setVisibleAvatar(false)}
          isVisible={visibleAvatar}>
          <Popup onPressUpload={openGallery} onPressCamera={openCamera}></Popup>
        </Modal>
      </SafeAreaView>
      <OKMessageBox
        visible={visible}
        title={title}
        clickCancel={() => {
          if (title === 'Success') {
            props.navigation.goBack();
          } else {
            setVisible(false);
          }
        }}
        message={message}
      />
    </ScrollView>
  );
};

export default EditMyInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  header: {
    flex: 0.3,
    backgroundColor: color.TitleActive,
  },
  viewInput: {
    width: scale(295),
    height: scale(51),
    borderColor: color.GraySolid,
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
  },
  body: {
    flex: 0.7,
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    width: '10%',
    marginBottom: scale(10),
    marginLeft: scale(5),
  },
  edit: {
    marginTop: scale(-35),
    marginLeft: scale(270),
  },
  icon1: {
    alignItems: 'center',
    width: '10%',
    marginBottom: scale(8),
    marginLeft: scale(5),
  },
  button: {
    marginTop: scale(-10),
    marginLeft: scale(150),
  },
  buttonTitle: {
    fontWeight: '400',
    fontSize: scale(12),
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  inputName: {
    flexDirection: 'row',
    marginTop: scale(80),
    width: scale(295),
    justifyContent: 'space-between',
  },
  inputFirstName: {
    borderBottomWidth: 1,
    width: scale(107),
  },
  inputLastName: {
    borderBottomWidth: 1,
    width: scale(180),
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: scale(10),
    width: scale(295),
    height: scale(51),
    borderColor: color.GraySolid,
    borderBottomWidth: 1,
  },
  inputBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(10),
    width: scale(295),
    borderColor: color.GraySolid,
    borderBottomWidth: 1,
  },
  inputName1: {
    color: color.TitleActive,
    fontSize: 16,
    marginLeft: scale(5),
  },
  inputText: {
    width: '85%',
    color: color.TitleActive,
    marginTop: scale(10),
    textAlignVertical: 'bottom',
    paddingHorizontal: scale(10),
    fontSize: scale(16),
    paddingBottom: scale(5),
    fontFamily: FONT_FAMILY.RegularForAddress,
  },
  inputPass: {
    color: color.TitleActive,
    fontSize: 16,
    top: scale(-5),
    marginLeft: scale(25),
  },
  buttonSignIn: {
    marginTop: scale(61),
  },
  viewModal: {
    width: '100%',
    backgroundColor: color.White,
    marginLeft: 0,
    marginTop: 'auto',
    flex: 0.2,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  textFailedPass: {
    alignSelf: 'flex-start',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(10),
    color: color.RedSolid,
    marginTop: scale(5),
    width: scale(295),
  },
  textFailed: {
    alignSelf: 'flex-start',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(10),
    color: color.RedSolid,
    marginTop: scale(5),
  },
});
