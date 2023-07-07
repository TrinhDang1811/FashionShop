import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';

//component
import {IC_AddImage, IC_Backward, IC_Close} from '../../assets/icons';
import color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';
import scale from '../../constants/responsive';
import SingleLine from '../../components/inputTexts/singleLine';
import MultiLine from '../../components/inputTexts/multiLine';
import TagWithoutDelete from '../../components/tags/tagWithoutDelete';
import Message from '../../components/alearts.js/messageOnly';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import LoadingModal from '../../components/loadingModal/loadingModal';


const addItemSchema = yup.object({
  name: yup
    .string()
    .required('Name cannot be blank')
    .max(100, 'Name length must be less than 50 characters'),
  price: yup.number().required('Price can not be blank'),
  material: yup
    .string()
    .required('Material description cannot be blank')
    .min(5, 'A material must have minimum of 5 character')
    .max(500, 'A material must have maximum of 500 character'),
  care: yup
    .string()
    .required('Care description cannot be blank')
    .min(5, 'A care must have minimum of 5 character')
    .max(500, 'A care must have maximum of 500 character'),
  description: yup
    .string()
    .required('Description cannot be blank')
    .min(5, 'A description must have minimum of 5 character')
    .max(500, 'A description must have maximum of 500 character'),
  //   category: yup.object().string().required('please select a category'),
  //   tag: yup.object().string().required('please select a tag'),
  categoryId: yup
    .string().required('Please choose category for the product'),
  tag: yup
    .array()
    // .shape({
    //   tagName: yup.string().required('please select a tag'),
    // })
    .required('please select a tag'),
  image: yup.number().moreThan(0, 'A blog must have at least 1 image').lessThan(6, 'A blog should have no more than 5 images')
});

const AddItemScreen = props => {
  const axiosPrivate = useAxiosPrivate();
  const [product, setProduct] = useState(init);
  const [loading, setLoading] = useState(false);

  // yup
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      material: '',
      care: '',
      description: '',
      price: null,
      tag: null,
      categoryId: null,
      image: null,
    },
    resolver: yupResolver(addItemSchema),
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCategory = async () => {
      try {
        const response = await axiosPrivate.get('/category-child', {
          signal: controller.signal,
        });
        const handledCategory = [];
        await Promise.all(
          response.data.category.map(item => {
            handledCategory.push({
              label: item.name + ' (' + item.parentName + ')',
              value: item._id,
            });
          }),
        );
        isMounted && setCategory(handledCategory);
      } catch (err) {
        console.log(err.response.data);
      }
    };

    const getTags = async () => {
      try {
        const response = await axiosPrivate.get('/get-all-tag', {
          signal: controller.signal,
        });

        const handledTag = [];
        await Promise.all(
          response.data.map(item => {
            handledTag.push({label: item.name, value: item._id});
          }),
        );
        isMounted && setTag(handledTag);
      } catch (err) {
        console.log(err.response.data);
      }
    };

    getTags();
    getCategory();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);

  const createProduct = async (data) => {
    setLoading(true);
    const formData = new FormData();
    await Promise.all(
      images.map(item => {
        formData.append('imageProduct', {
          name: new Date() + '_imageProduct',
          uri: item,
          type: 'image/jpg',
        });
      }),
    );
    formData.append('categoryId', product.categoryId);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('material', data.material);
    formData.append('care', data.care);
    formData.append('description', data.description);
    product.tag.map(item => {
      formData.append('tag', item.tagId);
    });
    console.log("hi", formData._parts);
    try {
      const res = await axiosPrivate.post('/post-create-product', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res.data);
      props.navigation.navigate('AddDetailItem', {data: res.data.product});
    } catch (err) {
      console.log(err.response.data);
      setTitle('Error');
      setMessage(err.response.data.error);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const handleChange = (e, prop) => {
    setProduct({
      ...product,
      [prop]: e.nativeEvent.text,
    });
  };

  const handlePickCategory = val => {
    console.log(val);
    setProduct({
      ...product,
      categoryId: val.value,
      categoryName: val.label,
    });

    console.log(product);
  };

  const handlePickTag = (val)=>{
    // add pick tag
    const newTag = {tagName: val.label, tagId: val.value};
    const newTagArray = [...product.tag, newTag];
    setProduct({
        ...product, 
        tag: newTagArray
    });
    console.log(product);
    // remove picked tag
    const newTagList = tag.filter((tag) => tag.value !== newTag.tagId);
    setTag(newTagList);
}

  const handleUnpickTag = (val, onChange) => {
    // remove from picked tag
    console.log("value", {val})
    const newProductTag = product.tag.filter(tag => tag.tagId !== val);
    const unpickedTag = product.tag.find(tag => tag.tagId === val);
    console.log(newProductTag, unpickedTag);
    setProduct({...product, tag: newProductTag});
    // add unpick tag
    setTag([...tag, {label: unpickedTag.tagName, value: unpickedTag.tagId}]);
    console.log(product.tag, tag);
    onChange(newProductTag);
    if(newProductTag.length === 0 ) onChange(null);

  };

  // image handle
  const [images, setImages] = useState([]);

  const checkReadImagePermission = (onchange) => {
    check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            requestPermission();
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            requestPermission();
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            ImageCropPicker.openPicker({
              width: 343,
              height: 460,
              cropping: true,
            })
              .then(image => {
                onchange(images.length + 1);
                setImages([...images, image.path]);
                console.log(images);
              })
              .catch(err => console.log('Error: ', err.message));
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(err => console.log(err));
  };

  const requestPermission = () => {
    request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(response => {
      console.log(response);
    });
  };

  const removeImage = (path, onChange) => {
    const newImageArray = images.filter(image => image !== path);
    setImages(newImageArray);
    onChange(newImageArray.length);
  }
  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal modalVisible={loading} />
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backwardButton}
          onPress={() => props.navigation.goBack()}>
          <IC_Backward stroke={color.White}></IC_Backward>
        </TouchableOpacity>
        <View>
          <Text style={styles.textHeader}>Add item</Text>
        </View>
      </View>
      {/* body */}
      <View style={styles.body}>
        <KeyboardAvoidingView style={{flex: 1}}>
          <ScrollView
            overScrollMode="auto"
            contentContainerStyle={{flexGrow: 1}}>
            {/* image */}
            <Controller
              name="image"
              control={control}
              render={({field: {onChange, value}}) => (
                <View style={styles.imagePart}>
                  <Text style={styles.bodyText}>Image</Text>
                  <ScrollView horizontal={true}>
                    <View style={styles.imageRow}>
                      {images.map(image => (
                        <View
                          key={image}
                          style={{width: scale(50), height: scale(67)}}>
                          <TouchableOpacity style={styles.removeButton} hitSlop={10} onPress={() => removeImage(image, onChange)}>
                            <IC_Close viewBox={`-3 -3 30 30`}/>                                       
                          </TouchableOpacity> 
                          <Image
                            resizeMode="cover"
                            style={{width: '100%', height: '100%'}}
                            source={{uri: image}}
                            // onLoad={image=>onchange(image)}
                          />
                        </View>
                      ))}
                      <TouchableOpacity onPress={() => checkReadImagePermission(onChange)}>
                        <View style={styles.imageView}>
                          <IC_AddImage />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                  {errors?.image && (
                    <Text style={styles.textFailed}>
                      {errors.image.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* input */}
            <View style={styles.informationPart}>
              <Text style={styles.bodyText}>Item information</Text>

              {/* name */}
              <Controller
                name="name"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <SingleLine
                      onChangeText={name => onChange(name)}
                      name="name"
                      placeholder={'Name'}
                      handleChange={handleChange}
                      keyboardType="default"
                      value={value}
                    />
                    {errors?.name && (
                      <Text style={styles.textFailed}>
                        {errors.name.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* price */}
              <Controller
                name="price"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <SingleLine
                      onChangeText={price => onChange(price)}
                      name="price"
                      placeholder={'Price'}
                      handleChange={handleChange}
                      keyboardType="number-pad"
                      value={value}
                    />
                    {errors?.price && (
                      <Text style={styles.textFailed}>
                        {errors.price.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Text style={styles.propText}>
                Material Description: 
              </Text>

              {/* material */}
              <Controller
                name="material"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <MultiLine
                      onChangeText={material => onChange(material)}
                      name="materialDescription"
                      handleChange={handleChange}
                      keyboardType="default"
                      value={value}
                    />
                    {errors?.material && (
                      <Text style={styles.textFailed}>
                        {errors.material.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Text style={styles.propText}>
                Care Description: 
              </Text>

              {/* care */}
              <Controller
                name="care"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <MultiLine
                      onChangeText={care => onChange(care)}
                      name="careDescription"
                      handleChange={handleChange}
                      keyboardType="default"
                      value={value}
                    />
                    {errors?.care && (
                      <Text style={styles.textFailed}>
                        {errors.care.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Text style={styles.propText}>
                Description:
              </Text>

              {/* description */}
              <Controller
                name="description"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <MultiLine
                      onChangeText={description => onChange(description)}
                      name="description"
                      handleChange={handleChange}
                      keyboardType="default"
                      value={value}
                    />
                    {errors?.description && (
                      <Text style={styles.textFailed}>
                        {errors.description.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* category */}
              <Controller
                name="categoryId"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <View style={styles.categoryBox}>
                      <View>
                        <DropDownPicker
                          listMode="MODAL"
                          open={categoryOpen}
                          placeholder="Category"
                          style={styles.categoryDropDown}
                          textStyle={styles.dropdownText}
                          items={category}
                          setOpen={setCategoryOpen}
                          modalProps={{
                            animationType: 'fade',
                          }}
                          onSelectItem={item => {
                            handlePickCategory(item);
                            onChange(item.value);
                          }}
                        />
                      </View>
                      <View style={styles.categoryView}>
                        <Text style={styles.dropdownText}>
                          Chosen category:
                        </Text>
                        <TagWithoutDelete
                          value={product.categoryName}
                          cancel={false}
                        />
                      </View>
                    </View>
                    {errors?.categoryId && (
                      <Text style={styles.textFailed}>
                        {errors.categoryId.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* tag */}
              <Controller
                name="tag"
                control={control}
                render={({field: {onChange, value}}) => (
                  <View>
                    <View style={styles.categoryBox}>
                      <View>
                        <DropDownPicker
                          listMode="MODAL"
                          open={tagOpen}
                          placeholder="Tags"
                          style={styles.categoryDropDown}
                          textStyle={styles.dropdownText}
                          items={tag}
                          setOpen={setTagOpen}
                          modalProps={{
                            animationType: 'fade',
                          }}
                          onSelectItem={item => [
                            handlePickTag(item),
                            onChange(product.tag),
                          ]}
                        />
                      </View>

                      <View style={{flex: 1}}>
                        <Text style={styles.dropdownText}>Chosen tags:</Text>
                        <ScrollView horizontal={true}>
                          <View
                            style={{flex: 1, flexDirection: 'row', gap: 10}}>
                            {product.tag.map(tag => (
                              <TagWithoutDelete
                                key={tag.tagId}
                                value={tag.tagName}
                                cancel={true}
                                tagId={tag.tagId}
                                onPress={val => handleUnpickTag(val , onChange)}
                              />
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                    {errors?.tag && (
                      <Text style={styles.textFailed}>
                        {errors.tag.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <View
                style={styles.line}></View>
              <TouchableOpacity onPress={handleSubmit(createProduct)}>
                <View style={styles.itemDetailButton}>
                  <Text style={styles.propText}>
                    Create item & move to Item detail
                  </Text>
                  <View
                    style={{
                      marginTop: scale(20),
                      transform: [{rotate: '180deg'}],
                    }}>
                    <IC_Backward stroke={color.TitleActive}></IC_Backward>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Message
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
    </SafeAreaView>
  );
};

export default AddItemScreen;

const init = {
  name: '',
  price: 0,
  materialDescription: '',
  careDescription: '',
  tag: [],
  categoryId: '',
  categoryName: '',
  description: '',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // header
  header: {
    flexDirection: 'row',
    backgroundColor: color.TitleActive,
    height: Dimensions.get('screen').height * 0.1,
    alignItems: 'center',
  },
  textHeader: {
    color: color.White,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 24,
    marginTop: scale(10),
  },
  backwardButton: {
    marginLeft: scale(15),
    marginTop: scale(10),
  },

  //  body
  body: {
    flex: 1,
    backgroundColor: color.White,
    paddingHorizontal: scale(10),
  },
  bodyText: {
    color: color.Body,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 23,
    marginLeft: scale(3),
  },

  // image
  imagePart: {
    paddingTop: scale(10),
    // borderWidth: 1,
  },
  imageRow: {
    paddingVertical: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: scale(10),
  },
  imageView: {
    width: scale(50), 
    height: scale(67), 
    justifyContent: 'center'
  },
  removeButton: {
    position: 'absolute', 
    width: scale(20), 
    height: scale(20), 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1, 
    top: scale(-7), 
    right: scale(-7), 
    borderRadius: 100, 
    backgroundColor: color.Line
  },

  // information
  informationPart: {
    flex: 1,
  },
  propText: {
    color: color.PlaceHolder,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: scale(16),
    marginLeft: scale(3),
    marginTop: scale(20),
  },

  // category
  categoryDropDown: {
    borderRadius: 0,
    borderColor: color.PlaceHolder,
    width: scale(120),
    paddingVertical: 15,
  },
  dropdownText: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
  },
  categoryBox: {
    marginTop: scale(15),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(15),
  },
  categoryView: {
    alignItems: 'flex-start',
  },
  // detail button
  itemDetailButton: {
    paddingBottom: scale(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: color.PlaceHolder,
    marginTop: scale(20),
  },

  //fail
  textFailed: {
    paddingLeft: scale(25),
    justifyContent: 'center',
    fontFamily: FONT_FAMILY.Italic,
    fontSize: scale(12),
    color: color.RedSolid,
  },
});
