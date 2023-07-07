import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {React, useState} from 'react';
import color from '../../../constants/color';
import FONT_FAMILY from '../../../constants/fonts';
import scale from '../../../constants/responsive';
import {LineBottom} from '../../../components/footer/images';
import {Controller, useForm} from 'react-hook-form';
import MultiLine from '../../../components/textFormat/multiLine';
import {
  IC_Satisfy,
  IC_UnSatisfy,
  IC_Normal,
  IC_Camera,
} from '../../../assets/icons';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import YesNoMessageBox from '../../../components/messageBox/YesNoMessageBox';
import OKMessageBox from '../../../components/messageBox/OKMessageBox';
import { useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import Modal from 'react-native-modal';
import Popup from '../userInfo/editMyInfoScreen/component/popup';
import PriceAttribute from '../orders/components/priceAttribute';

const ProductReviewScreen = props => {

  const {data} = props.route.params;
  console.log({data})
  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;
  const axiosPrivate = useAxiosPrivate();
  const [rate, setRate] = useState();
  const [comment, setComment] = useState('');
  const [image, setImage] = useState([]);
  const [visibleImage, setVisibleImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  console.log({image});

  let options = {
    savePhotos: true,
    mediaType: 'photo',
  };
  const openGallery = async () => {
    const result = await launchImageLibrary(options);
    setImage([...image,result.assets[0].uri]);
    setVisibleImage(false);
  };
  const openCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options);
      setImage([...image,result.assets[0].uri]);
      console.log({image});
      setVisibleImage(false);
    }
  };

  async function handleSubmits() {
    setLoading(true);
    const formData = new FormData();
    formData.append('rate', rate);
    formData.append('comment', comment);
    formData.append('productId', data.detail.productDetailId.productId._id);
    formData.append('userId', userInfo._id);
    formData.append('productDetailId', data.detail.productDetailId._id);
    formData.append('orderId', data.orderId);
    await Promise.all(
      image.map((item,index) => (
        formData.append('imageRating', {
          name: new Date() + `_imageRating_${index}`,
          uri: item,
          type: 'image/jpg',
        })
      )),
    );

    console.log(formData);
    try {
      const response = await axiosPrivate.post(`/post-create-rating`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('success', JSON.stringify(response.data));
      setTitle('Success');
      setMessage(`Post rating successful!`);
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


  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    // mode: 'onChange',
    // defaultValues: {
    //   firstName: userInfo.firstName,
    //   lastName: userInfo.lastName,
    //   // email: '',
    //   phoneNumber: userInfo.phoneNumber,
    //   password: '',
    //   passwordConfirm: '',
    // },
    // resolver: yupResolver(signUpPayloadSchema),
  });
  return (
    <SafeAreaView style={styles.container}>
      <OKMessageBox visible={visible} 
          clickCancel={() => {title === 'Error' ? setVisible(false):props.navigation.navigate('OrdersScreen')}} 
          title={title} 
          message={message}/>
        <View style={styles.introTextBox}>
          <Text style={styles.introText}>PRODUCT REVIEW</Text>
          <Image
            source={LineBottom}
            style={{alignSelf: 'center', marginTop: scale(10)}}
          />
        </View>
        <View key={data.detail.productDetailId._id} style={{marginLeft: scale(20), marginTop:scale(20)}}>
          <PriceAttribute
            onPress={() => {
              props.navigation.navigate('ProductStackScreen', {
                screen: 'ProductDetailsScreen',
                params: {data: data.detail.productDetailId.productId},
              })
            }}
            key={data.orderId}
            ratingData={null}
            image={data.detail.productDetailId.productId.posterImage.url}
            qty={data.detail.quantity}
            name={data.detail.productDetailId.productId.name}
            price={data.detail.productDetailId.productId.price}
            sizeName={data.detail.productDetailId.sizeId.name}
            colorCode={data.detail.productDetailId.colorId.code}
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.successText}>
            Rate your experience and the product's quality!
          </Text>
          <View style={styles.icon}>
            <TouchableOpacity onPress={() => setRate(1)}>
              <IC_UnSatisfy border={rate === 1 ? color.Primary:'#E0CFBA'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRate(2)}>
              <IC_Normal border={rate === 2 ? color.Primary:'#E0CFBA'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRate(3)}>
              <IC_Satisfy border={rate === 3 ? color.Primary:'#E0CFBA'}/>
            </TouchableOpacity>
          </View>
          <View style={styles.commentBox}>
            <Controller
              name="comment"
              control={control}
              render={({field: {onChange, value}}) => (
                <>
                  <MultiLine
                    name="comment"
                    placeholder="Comment"
                    keyboardType="default"
                    onChangeText={text => [setComment(text), onChange(text)]}
                    style={styles.comment}
                  />
                </>
              )}
            />
          </View>
          {image.length !== 0 ? (
          <View style={{flexDirection:'row',width:'91%'}}>
            {image.map((item,index) => (
              <View
              key={index}
              style={{marginTop:scale(30),width: scale(60), height: scale(60),backgroundColor:color.Background,marginRight:scale(10)}}>
                <Image
                  resizeMode="cover"
                  style={{width: '100%', height: '100%'}}
                  source={{uri: `${item}`}}
                />
              </View>
            ))}
            {image.length === 5 ? (null):(<TouchableOpacity style={{marginTop:scale(30),backgroundColor:color.AthensGray,
              width: scale(60), height:scale(60), alignItems:'center',paddingVertical:scale(7)}}
              onPress={() => setVisibleImage(true)}>
              <IC_Camera/>
              <Text style={{color: color.TitleActive, fontSize: 16,
                fontWeight: '400', fontFamily: FONT_FAMILY.Regular}}>
                {' Add'}
              </Text>
            </TouchableOpacity>)}
          </View>
          ):(
          <TouchableOpacity style={{marginTop:scale(30),backgroundColor:color.AthensGray, justifyContent:'space-between',
            width: scale(340), height:scale(60), alignItems:'center',paddingVertical:scale(7)}}
            onPress={() => setVisibleImage(true)}>
            <IC_Camera/>
            <Text style={{color: color.TitleActive, fontSize: 20,
              fontWeight: '600', fontFamily: FONT_FAMILY.Regular}}>
              {'Add photos'}
            </Text>
          </TouchableOpacity>)}
          <View
            style={{
              marginTop: scale(70),
              justifyContent: 'flex-end',
              width: scale(320),
          }}>
            <TouchableOpacity style={styles.submit} onPress={handleSubmits}>
              <Text style={styles.submitText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          style={styles.viewModal}
          onBackdropPress={() => setVisibleImage(false)}
          onBackButtonPress={() => setVisibleImage(false)}
          isVisible={visibleImage}
          >
          <Popup onPressUpload={openGallery} onPressCamera={openCamera}></Popup>
        </Modal>
    </SafeAreaView>
  );
};

export default ProductReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  viewModal: {
    width: '100%',
    backgroundColor: color.OffWhite,
    marginLeft: 0,
    marginTop: 'auto',
    flex: 0.2,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  introTextBox: {
    alignSelf: 'center',
    marginTop: scale(30),
  },
  introText: {
    color: color.TitleActive,
    fontSize: 18,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
    letterSpacing: 4,
    alignSelf: 'center',
  },
  body: {
    marginTop: scale(10),
    backgroundColor: color.White,
    alignItems: 'center',
  },
  viewInput: {
    marginTop: scale(10),
    width: scale(295),
    height: scale(51),
    borderColor: color.GraySolid,
  },
  inputName: {
    flexDirection: 'row',
    marginTop: scale(10),
    width: scale(339),
    height: scale(51),
    justifyContent: 'space-between',
  },
  inputFirstName: {
    borderBottomWidth: 1,
    width: scale(130),
    height: scale(51),
    borderColor: color.GraySolid,
  },
  inputLastName: {
    borderBottomWidth: 1,
    width: scale(190),
    height: scale(51),
    borderColor: color.GraySolid,
  },
  inputCode: {
    flexDirection: 'row',
    marginTop: scale(10),
    width: scale(339),
    height: scale(51),
    justifyContent: 'space-between',
  },
  inputState: {
    borderBottomWidth: 1,
    width: scale(130),
    height: scale(51),
    borderColor: color.GraySolid,
  },
  inputZipCode: {
    borderBottomWidth: 1,
    width: scale(190),
    height: scale(51),
    borderColor: color.GraySolid,
  },
  inputMailBox: {
    marginTop: scale(10),
    width: scale(339),
    height: scale(51),
    borderColor: color.GraySolid,
    borderBottomWidth: 1,
  },
  inputText: {
    color: color.TitleActive,
    fontSize: scale(16),
    marginLeft: scale(5),
    marginTop: scale(10),
  },
  textFailed: {
    alignSelf: 'flex-start',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(12),
    color: color.RedSolid,
    marginTop: scale(5),
  },
  totalBorder: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 0,
  },
  total: {
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
  },
  price: {
    marginTop: scale(-13),
    alignSelf: 'flex-end',
    color: color.Primary,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
  },
  placeOrder: {
    marginTop: scale(20),
    width: scale(375),
    height: scale(56),
    backgroundColor: color.TitleActive,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    color: color.White,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    alignSelf: 'center',
    marginTop: scale(20),
    width: scale(150),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  successText: {
    color: color.TitleActive,
    fontSize: 18,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
    alignSelf: 'center',
    marginTop: scale(10),
  },
  submit: {
    width: '100%',
    height: scale(48),
    backgroundColor: color.TitleActive,
    justifyContent: 'center',
  },
  submitText: {
    color: color.White,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILY.Regular,
    alignSelf: 'center',
  },
  backHome: {
    width: scale(150),
    height: scale(48),
    backgroundColor: color.White,
    justifyContent: 'center',
    borderWidth: 1,
  },
  backText: {
    color: color.TitleActive,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: FONT_FAMILY.Regular,
    alignSelf: 'center',
  },
  comment: {
    width: scale(300),
    height: scale(200),
    alignSelf: 'center',
  },
  commentBox: {
    marginTop: scale(10),
    width: scale(425),
    alignItems: 'center',
  },
});
