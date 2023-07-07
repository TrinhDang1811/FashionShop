import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Custom_Footer from '../../../../../components/footer/Custom_Footer';
import color from '../../../../../constants/color';
import AddToBasket from '../../../../../components/buttons/AddToBasket';
import {
  IC_Export,
  IC_DoNotBleach,
  IC_DoNotTumbleDry,
  IC_DoNotWash,
  IC_Iron,
  IC_Resize,
  IC_UnSatisfy,
  IC_Normal,
  IC_Satisfy,
  IC_BackwardArrow,
  IC_ForwardArrow,
} from '../../../../../assets/icons';
import {
  IMG_ModelFour,
  IMG_ModelOne,
  IMG_ModelTwo,
  IMG_ModelThree,
} from '../../../../../assets/images';
import {LineBottom} from '../../../../../components/footer/images';
import scale from '../../../../../constants/responsive';
import SwiperFlatList from 'react-native-swiper-flatlist';
import FONT_FAMILY from '../../../../../constants/fonts';
import fontStyles from '../../../../../constants/fontStyle';
import Custom_GridViewProd from '../../../../../components/products/CustomGridViewProd';
import ZoomImageView from './ZoomImageView';
import {useSelector} from 'react-redux';
import {addToCart} from '../../../../../redux/actions/cartActions';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import Policy from './Policy';
import OKMessageBox from '../../../../../components/messageBox/OKMessageBox';

const ProductDetailsScreen = props => {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(1);
  const [colorChoose, setChooseColor] = useState(0);
  const [sizeChoose, setChooseSize] = useState(0);
  const [detailChoose, setDetailChoose] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [suggestiveProduct, setSuggestiveProduct] = useState([]);
  const [rating, setRating] = useState([]);
  const [average, setAverage] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const [availableColor, setAvailableColor] = useState([]);
  const [availableSize, setAvailableSize] = useState([]);
  const [notExistSize, setNotExistSize] = useState(false);
  const {data} = props.route.params;
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;

  const dispatch = useDispatch();
  const addToCartHandler = async () => {
    const selectedDetail = details.find(item => {
      if (item.sizeId === sizeChoose && item.colorId === colorChoose) {
        return item;
      }
    });
    if(selectedDetail===undefined)
    {
      setNotExistSize(true)
    }
    setDetailChoose(selectedDetail);
    dispatch(
      addToCart(
        data,
        selectedDetail._id,
        selectedDetail.colorCode,
        selectedDetail.sizeName,
        count,
      ),
    );
  };

  useEffect(() => {
    const handleProductImages = async () => {
      const listOfProductImages = [];
      await Promise.all(
        data.image.map(async image => {
          listOfProductImages.push({id: image._id, image: image.url});
        }),
      );
      setProductImages(listOfProductImages);
    };
    handleProductImages();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getDetailsById = async id => {
      try {
        const response = await axiosPrivate.get(
          `/get-detail-by-productId/${id}`,
          {
            signal: controller.signal,
          },
        );
        console.log('details: ', JSON.stringify(response.data));
        setDetails(response.data);
        response.data.map(detail => {
          const isExistColor = availableColor.find(element => {
            if (element.colorId === detail.colorId) {
              return true;
            }
            return false;
          });
          if (!isExistColor) {
            let newColorArray = availableColor;
            newColorArray.push({
              colorId: detail.colorId,
              colorCode: detail.colorCode,
            });
            setAvailableColor([...newColorArray]);
          }
        });
      } catch (err) {
        console.log(err.response.data);
      }
    };
    const getSuggestiveProduct = async number => {
      try {
        const response = await axiosPrivate.get(
          `/get-random-product/${number}`,
          {
            signal: controller.signal,
          },
        );
        setSuggestiveProduct(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    const getRating = async id => {
      try {
        const response = await axiosPrivate.get(
          `/get-rating-by-productId/${id}`,
          {
            signal: controller.signal,
          },
        );
        setRating(response?.data);
        let averageRating = 0;
        response?.data.map((rate) => 
          averageRating = averageRating + parseInt(rate.rate)
        )
        averageRating /= response?.data.length;
        averageRating = Math.round(averageRating)
        console.log(averageRating)
        setAverage(averageRating)    
      } catch (err) {
        console.log(err.response.data);
      }
    };
    getRating(data._id);
    getSuggestiveProduct(4);
    getDetailsById(data._id);
    
    return () => {
      controller.abort();
    };
  }, []);
  const handleChooseColor = colorId => {
    setChooseColor(colorId);
    const selectedDetails = details.filter(item => item.colorId === colorId);
    let newSizeArray = [];
    selectedDetails.map(detail => {
      newSizeArray.push({sizeId: detail.sizeId, sizeName: detail.sizeName});
    });
    setAvailableSize(newSizeArray);
    setChooseSize(0);
  };
  const handleChooseSize = sizeId => {
    setChooseSize(sizeId);
  };

  return visible ? (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <OKMessageBox
          visible={notExistSize}
          clickCancel={() => {
            setNotExistSize(false);
          }}
          title={'NO SELECTED DETAIL YET'}
          message={'You need to choose detail!'}
        />
        {/* Product Images */}
        <View style={styles.productContainer}>
          <SwiperFlatList
            showPagination
            paginationStyle={styles.wrapDot}
            paginationStyleItemActive={styles.dotActive}
            paginationStyleItemInactive={styles.dot}
            paginationDefaultColor={color.PlaceHolder}
            paginationActiveColor={color.TitleActive}
            data={productImages}
            renderItem={({item}) => (
              <View
                style={{
                  width: Dimensions.get('window').width,
                  paddingHorizontal: scale(16),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: scale(510),
                }}
                key={item => `${item.id}`}>
                <View style={styles.imgContainer}>
                  <Image
                    source={{uri: `${item.image}`}}
                    style={styles.img}
                    resizeMode="cover"
                  />
                </View>
              </View>
            )}
          />
          <TouchableOpacity onPress={() => setVisible(false)}>
            <IC_Resize
              style={{
                left: scale(130),
                bottom: scale(30),
                position: 'absolute',
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Product Variation */}
        <View style={styles.productVariationContainer}>
          <View style={styles.nameView}>
            <Text style={styles.prodName}>{data.name}</Text>
          </View>
          <View style={styles.descriptionView}>
            <Text style={styles.prodDescription}>{data.description}</Text>
          </View>
          <Text style={styles.prodPrice}>${data.price}</Text>
          <>
            <View style={{flexDirection: 'row', marginTop: scale(18)}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: scale(12),
                  width: '40%',
                  gap: scale(10),
                }}>
                <Text
                  style={{
                    color: color.Label,
                    fontFamily: FONT_FAMILY.Regular,
                    fontSize: scale(16),
                    lineHeight: scale(18),
                  }}>
                  Color
                </Text>
                {availableColor.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      borderRadius: 360,
                      borderColor:
                        colorChoose === item.colorId
                          ? color.Primary
                          : color.TitleActive,
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: scale(22),
                      height: scale(22),
                    }}
                    onPress={() => handleChooseColor(item.colorId)}
                    key={index}>
                    <View
                      style={{
                        borderRadius: 360,
                        backgroundColor: item.colorCode,
                        width: scale(16),
                        height: scale(16),
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: scale(35),
                  paddingHorizontal: scale(12),
                  width: '40%',
                  gap: scale(10),
                }}>
                <Text
                  style={{
                    color: color.Label,
                    fontFamily: FONT_FAMILY.Regular,
                    fontSize: scale(16),
                    lineHeight: scale(18),
                  }}>
                  Size
                </Text>
                {availableSize.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      borderRadius: 360,
                      borderWidth: 1,
                      borderColor:
                        sizeChoose === item.sizeId ? color.Body : color.Border,
                      width: scale(16),
                      height: scale(16),
                      alignItems: 'center',
                      backgroundColor:
                        sizeChoose === item.sizeId
                          ? color.Body
                          : color.OffWhite,
                    }}
                    onPress={() => handleChooseSize(item.sizeId)}
                    key={index}>
                    <Text
                      style={{
                        color:
                          sizeChoose === item.sizeId
                            ? color.OffWhite
                            : color.TitleActive,
                        fontFamily: FONT_FAMILY.Regular,
                        fontSize: scale(12),
                        lineHeight: scale(14),
                        textAlign: 'center',
                      }}>
                      {item.sizeName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        </View>
        {/* Button Add To Basket */}
        <View style={{marginTop: scale(24.5)}}>
          <AddToBasket
            onPress={() => {
              addToCartHandler();
            }}
          />
        </View>
        {/* Product Detail */}
        <View style={styles.detailView}>
          <Text style={[fontStyles.subTitle16pxFont, styles.title]}>
            MATERIALS
          </Text>
          <Text style={[fontStyles.bodyMediumFont, styles.subTitle]}>
            {data.material}
          </Text>
          <Text style={[fontStyles.subTitle16pxFont, styles.title]}>CARE</Text>
          <Text style={[fontStyles.bodyMediumFont, styles.subTitle]}>
            {data.care}
          </Text>
          <Text style={[fontStyles.subTitle16pxFont, styles.title]}>POLICY</Text>
          <Policy />
          <Text style={[fontStyles.subTitle16pxFont, styles.title]}>RATING</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between',
           marginTop: scale(20), marginLeft: scale(20), alignItems:'center'}}>
            <IC_UnSatisfy border={average === 1 ? color.Primary:'#E0CFBA'}/>
            <IC_Normal border={average === 2 ? color.Primary:'#E0CFBA'}/>
            <IC_Satisfy border={average === 3 ? color.Primary:'#E0CFBA'}/>
            <TouchableOpacity style={{width:scale(180),height:scale(50), alignItems:'center',
            justifyContent:'center',flexDirection:'row'}}
            onPress={() => props.navigation.navigate('ProductStackScreen', {
              screen: 'ProductRatingScreen',
              params: {data: rating},
            })}>
              <Text style={styles.seeMoreText}>See all ratings</Text>
              <IC_ForwardArrow/>
            </TouchableOpacity>
          </View>
        </View>
        {/* You May Also Like */}
        <View style={styles.likeProductContainer}>
          <Text style={styles.likeProductText}>YOU MAY ALSO LIKE</Text>
          <Image
            source={LineBottom}
            style={styles.lineBottom}
            resizeMode="stretch"
          />
          <FlatList
            contentContainerStyle={{
              alignContent: 'space-around',
              marginTop: scale(20),
            }}
            horizontal={false}
            data={suggestiveProduct}
            keyExtractor={item => `${item._id}`}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.wrapperLikeProducts}
            renderItem={({item}) => (
              <Custom_GridViewProd
                image={item.posterImage.url}
                prodName={item.name}
                prodPrice={item.price}
                onPress={() =>
                  props.navigation.navigate('ProductStackScreen', {
                    screen: 'ProductDetailsScreen',
                    params: {data: item},
                  })
                }
              />
            )}
          />
        </View>
        {/* Footer */}
        <Custom_Footer
          style={{justifyContent: 'flex-end', marginTop: scale(37)}}
          onAboutPress={() =>
            props.navigation.navigate('HomeStackScreen', {
              screen: 'OurStoryScreen',
            })
          }
          onContactPress={() =>
            props.navigation.navigate('HomeStackScreen', {
              screen: 'ContactUsScreen',
            })
          }
          onBlogPress={() =>
            props.navigation.navigate('BlogStackScreen', {
              screen: 'BlogGridViewScreen',
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  ) : (
    <ZoomImageView
      onPressVisible={() => setVisible(true)}
      productImages={productImages}
    />
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.OffWhite,
  },
  productContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  wrapDot: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    bottom: 0,
    top: scale(540),
  },
  dotActive: {
    marginHorizontal: scale(3),
    bottom: scale(50),
    width: scale(7),
    height: scale(7),
  },
  dot: {
    marginHorizontal: scale(3),
    bottom: scale(50),
    opacity: 0.27,
    size: 3,
    width: scale(7),
    height: scale(7),
  },
  imgContainer: {
    width: scale(343),
    height: scale(457.33),
  },
  img: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: scale(457.33),
  },
  productVariationContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '92%',
    marginHorizontal: scale(16),
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(12),
  },
  descriptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
  },
  prodName: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    lineHeight: scale(18),
    fontSize: scale(18),
  },
  seeMoreText: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    lineHeight: scale(18),
    fontSize: scale(18),
  },
  prodDescription: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    lineHeight: scale(16),
    fontSize: scale(16),
  },
  prodPrice: {
    fontFamily: FONT_FAMILY.Regular,
    lineHeight: scale(21),
    fontSize: scale(18),
    marginTop: scale(10),
    color: color.Primary,
  },
  detailView: {
    flexDirection: 'column',
    paddingHorizontal: scale(18),
    justifyContent: 'space-around',
  },
  title: {
    marginTop: scale(30),
    color: color.TitleActive,
  },
  subTitle: {
    marginLeft: scale(20),
    color: color.TitleActive,
  },
  iconTextView: {
    flexDirection: 'column',
    marginTop: scale(14),
  },
  likeProductContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(69),
    paddingTop: scale(32),
    paddingHorizontal: scale(10),
  },
  likeProductText: {
    fontSize: scale(18),
    lineHeight: scale(40),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    color: color.TitleActive,
  },
  lineBottom: {
    alignSelf: 'center',
  },
  productWrap: {
    justifyContent: 'space-around',
    height: scale(380),
    width: scale(265),
    alignItems: 'center',
    flexDirection: 'column',
  },
  wrapperLikeProducts: {
    marginBottom: scale(5),
  },
});
