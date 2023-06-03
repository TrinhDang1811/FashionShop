import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput} from 'react-native';
import {React, useEffect, useState} from 'react';
import color from '../../../../constants/color';
import FONT_FAMILY from '../../../../constants/fonts';
import scale from '../../../../constants/responsive';
import { IMG_Logo } from '../../../../assets/images';
import SaveButton from '../../../../components/buttons/Save';
import { LineBottom } from '../../../../components/footer/images';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import axios from 'axios';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const addNewAddressPayloadSchema = yup.object({
  firstName: yup.string()
  .max(30,'Invalid name')
  .required('Name cannot be blank'),
  lastName: yup.string()
  .max(30,'Invalid name')
  .required('Name cannot be blank'),
  city: yup.string()
  .max(70,'Invalid city')
  .required('City cannot be blank'),
  district: yup.string()
  .max(70,'Invalid district')
  .required('district cannot be blank'),
  ward: yup.string()
  .max(70,'Invalid ward')
  .required('ward cannot be blank'),
  streetAndNumber: yup.string()
  .max(70,'Invalid Street and number')
  .required('Street and number cannot be blank'),
  phoneNumber: yup
    .string()
    .min(10,'Invalid phone number')
    .max(11,'Invalid phone number')
    .matches(phoneRegExp, 'Invalid phone number'),
});


const AddNewAddressScreen = props => {
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState([]);
  const [streetAndNumber, setStreetAndNumber] = useState('');
  //const [phoneNumber, setPhoneNumber] = useState('');
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const [district, setDistrict] = useState('');
  const [districtList, setDistrictList] = useState([]);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [ward, setWard] = useState('');
  const [wardList, setWardList] = useState([]);
  const [wardOpen, setWardOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const user = useSelector(state => state.user);
  const {userItems} = user;
  const userInfo = userItems.user;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      // firstName:'',
      // lastName:'',
      // phoneNumber:'',
      city:null,
      district:null,
      ward:null,
      streetAndNumber:null,
      address: ''
    },
    resolver: yupResolver(addNewAddressPayloadSchema),
  });
  useEffect(() => {
    const controller = new AbortController();

    const getCities = async () => {
      
      try {
        const responseCity = await axios.get(`https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`, {
          signal: controller.signal, 
        });
        responseCity.data.data.data.map((item,index) => {
          const obj = {
            label: item.name_with_type,
            value: item.name,
            code: item.code
          }
          cityList[index] = obj;
        })
      } catch (err) {
        console.log(err.response.data);
      }
  };
  getCities();
    return () => {
      controller.abort();
    };
  }, []);
  
  const handleAddNewAddress = async (data) => {
    try {
      //setLoading(true);
      setAddress({
        city: city,
        district: district,
        ward: ward,
        streetAndNumber: streetAndNumber,
      } )
      console.log('address',JSON.stringify(address))
      const response = await axiosPrivate.put(
        `/add-new-address/${userInfo._id}`,
        JSON.stringify({
          addressObject: {
            city: city,
            district: district,
            ward: ward,
            streetAndNumber: streetAndNumber,
          }
        }),
      );
      console.log('success', JSON.stringify(response.data));
      //setLoading(false);
    } catch (error) {
      //setLoading(false);
      console.log("error", error.response.data)
  };
}
const handleCityChange = async(city) => {
  try{
    setDistrict('');
    setWard('');
    const responseDistrict = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${city.code}&limit=-1`);
        //console.log('districts: ' ,JSON.stringify(responseDistrict.data.data.data))
        responseDistrict.data.data.data.map((item,index) => {
          const obj = {
            label: item.name_with_type,
            value: item.name,
            code: item.code
          }
          districtList[index] = obj;
        })
  }
  catch (error) {
    console.log("error", error)
};
};
const handleDistrictChange = async(district) => {
  try{
    setWard('');
    const responseWard = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${district.code}&limit=-1`);
        
        responseWard.data.data.data.map((item,index) => {
          const obj = {
            label: item.name_with_type,
            value: item.name,
            code: item.code
          }
          wardList[index] = obj;
        })
  }
  catch (error) {
    console.log("error", error)
};
};
    return (
        <SafeAreaView style = {styles.container}>
            <View style={styles.introTextBox}>
                <Text style={styles.introText}>ADD SHIPPING ADDRESS</Text>
                <Image source={LineBottom} style={{alignSelf: 'center'}}/>
            </View>
            <View style={styles.body}>
              {/* <>
                <View style={styles.inputName}>
                  <Controller
                  name="firstName"
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View style={styles.inputFirstName}>
                      <View style={styles.viewInput}>
                        <TextInput
                          onChangeText={firstName => [onChange(firstName), setFirstName(firstName)]}
                          placeholder={userInfo.firstName}
                          value={value}
                          defaultValue={userInfo.firstName}
                          placeholderTextColor={color.GraySolid}
                          style={styles.inputText}
                          keyboardType="default"
                        />
                      </View>
                      {errors?.firstName && (
                        <Text style={styles.textFailed}>{errors.firstName.message}</Text>
                      )}
                    </View>
                    )}
                  />
                  <Controller
                  name="lastName"
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View style={styles.inputLastName}>
                      <View style={styles.viewInput}>
                        <TextInput
                          onChangeText={lastName => [onChange(lastName), setLastName(lastName)]}
                          placeholder={userInfo.lastName}
                          value={value}
                          defaultValue={userInfo.lastName}
                          placeholderTextColor={color.GraySolid}
                          style={styles.inputText}
                          keyboardType="default"
                        />
                      </View>
                      {errors?.lastName && (
                        <Text style={styles.textFailed}>{errors.lastName.message}</Text>
                      )}
                    </View>
                    )}
                  />
                </View>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View style={styles.inputPhoneNumber}>
                      <View style={styles.viewInput}>
                      <TextInput
                        onChangeText={phoneNumber => [onChange(phoneNumber), setPhoneNumber(phoneNumber)]}
                        placeholder={userInfo.phoneNumber}
                        value={value}
                        defaultValue={userInfo.phoneNumber}
                        placeholderTextColor={color.GraySolid}
                        style={styles.inputText}
                        keyboardType="default"
                      />
                      </View>
                      {errors?.phoneNumber && (
                        <Text style={styles.textFailed}>{errors.phoneNumber.message}</Text>
                      )}
                    </View>
                  )}
                />
                </> */}
                <>
                <Controller
                  name="city"
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View style={styles.dropdownCity}>
                      <DropDownPicker
                        searchable={true}
                        scrollViewProps={true}
                        style={styles.viewInput}
                        textStyle={styles.inputText}
                        value={city}
                        open={cityOpen}
                        items={cityList}
                        setItems={setCityList}
                        setOpen={setCityOpen}
                        setValue={setCity}
                        onSelectItem={item => [handleCityChange(item),onChange(item)]}
                        placeholder='Choose a city'
                      />
                      {errors?.city && (
                      <Text style={styles.textFailed}>{errors.city.message}</Text>
                    )}
                    </View>
                )}
              />
              <Controller
                  name="district"
                  control={control}
                  render={({field: {onChange, value}}) => (
                      <View style={styles.dropdownDistrict}>
                        <DropDownPicker
                          searchable={true}
                          style={styles.viewInput}
                          textStyle={styles.inputText}
                          value={district}
                          open={districtOpen}
                          items={districtList}
                          setItems={setDistrictList}
                          setOpen={setDistrictOpen}
                          setValue={setDistrict}
                          listParentContainerStyle={{height:scale(60)}}
                          onSelectItem={item => [handleDistrictChange(item),onChange(item)]}
                          placeholder='Choose a district'
                        />
                        {errors?.district && (
                      <Text style={styles.textFailed}>{errors.district.message}</Text>
                    )}
                      </View>
                       )}
                       />
                       <Controller
                        name="ward"
                        control={control}
                        render={({field: {onChange, value}}) => (
                      <View style={styles.dropdownWard}>
                        <DropDownPicker
                          searchable={true}
                          style={styles.viewInput}
                          textStyle={styles.inputText}
                          value={ward}
                          open={wardOpen}
                          items={wardList}
                          setItems={setWardList}  
                          setOpen={setWardOpen}
                          setValue={setWard}
                          onSelectItem={item => onChange(item)}
                          placeholder='Choose a ward'
                        />
                        {errors?.ward && (
                      <Text style={styles.textFailed}>{errors.ward.message}</Text>
                    )}
                      </View>
                      )}
                      />
                </>
                <Controller
                  name="streetAndNumber"
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View style={styles.inputStreetAndNumber}>
                      <View style={styles.viewInput}>
                      <TextInput
                        onChangeText={streetAndNumber => [onChange(streetAndNumber), setStreetAndNumber(streetAndNumber)]}
                        placeholder='Ex: 12 To Hieu street,...'
                        value={value}
                        placeholderTextColor={color.GraySolid}
                        style={styles.inputText}
                        keyboardType="default"
                      />
                      </View>
                      {errors?.streetAndNumber && (
                        <Text style={styles.textFailed}>{errors.streetAndNumber.message}</Text>
                      )}
                    </View>
                  )}
                />
            </View>
            <View style={styles.totalBorder}>
              <TouchableOpacity style={styles.placeOrder} onPress={handleSubmit(handleAddNewAddress)}>
                <Text style={styles.button}>ADD NOW</Text>
              </TouchableOpacity>
            </View>  
        </SafeAreaView>
    );
};

export default AddNewAddressScreen;

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: color.White,
    },
    introTextBox:{
        alignSelf: 'center',
        marginTop: scale(30),
    },
    introText: {
        color: color.TitleActive,
        fontSize: 18,
        fontWeight: 400,
        fontFamily: FONT_FAMILY.Regular,
        letterSpacing: 4,
    },
    body: {
        backgroundColor: color.White,
        alignItems: 'center',
      },
      viewInput: {
        marginTop: scale(10),
        height: scale(51),
        borderColor: color.GraySolid,
        borderRadius: 0,
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
      inputPhoneNumber:{
        marginTop: scale(10),
        width: scale(295),
        height: scale(51),
        borderColor: color.GraySolid,
        borderBottomWidth: 1,
      },
      inputStreetAndNumber:{
        marginTop: scale(25),
        width: scale(350),
        height: scale(51),
        borderColor: color.GraySolid,
        borderBottomWidth: 1,
        zIndex:-1
      },
      dropdownCity: {
        marginTop:scale(35),
        marginHorizontal: scale(10),
        color: color.White,
        zIndex: 6,
      },
      dropdownDistrict: {
        marginTop:scale(35),
        marginHorizontal: scale(10),
        color: color.White,
        zIndex: 4,
      },
      dropdownWard: {
        color: color.White,
        marginTop:scale(35),
        marginHorizontal: scale(10),
        zIndex: 2,
      },
      inputText: {
        color: color.TitleActive,
        fontSize: scale(16),
        marginLeft: scale(5),
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
        bottom: 0
      },
      total: {
        color: color.TitleActive,
        fontSize: 16,
        fontWeight: 400,
        fontFamily: FONT_FAMILY.Regular,
    },
    placeOrder:{
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
    },
});