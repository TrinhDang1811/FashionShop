import { StyleSheet, Text, View,SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput,Platform, KeyboardAvoidingView, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
//component
import color from '../../constants/color'
import scale from '../../constants/responsive'
import FONT_FAMILY from '../../constants/fonts'
import { IC_Delete, IC_Edit, IC_Search, IC_See, IC_BackwardArrow, IC_Backward, IC_Up } from '../../assets/icons'
import Item from './components/item'
import MessageYN from '../../components/alearts.js/messageYN'
//lib
import * as Progress from 'react-native-progress';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


const ListOfItemScreen = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);

  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('new')
  const [visible, setVisible] = useState(false);
  const [clickYes, setClickYes] = useState(() => async () => {setVisible(false)})
  const [clickNo, setClickNo] = useState(() => () => {setVisible(false)})
  const [loading, setLoading] = useState(false);
  const isFocus = useIsFocused();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get('/get-all-product', {
                signal: controller.signal
            });
            isMounted && setData(response.data);
        } 
        catch (err) {
            console.log(err.response.data);
        } 
        finally {
          setLoading(false);
        }
    }

    getProducts();

    return () => {
        isMounted = false;
        controller.abort();
    }

  }, [isFocus])

  const pressEdit = async (item) => {
    const controller = new AbortController();
    let categoryName = '';
    try {
      const response = await axiosPrivate.get(`/category/${item.categoryId}`, {
          signal: controller.signal
      });
      categoryName = response.data.name + ' (' + response.data.parentName + ')';
      console.log(response.data);
    } 
    catch (err) {
        console.log(err);
    }
    console.log(categoryName)
    props.navigation.navigate("EditItem",{
      data: item,
      categoryName: categoryName
    })
  }

  const deleteItem = async (id, name) => {
    setTitle('Delete product');
    setMessage(`Do you want to delete ${name} product`)
    setStatus('new')
    const newClickYes = async () => {
      try {
        setStatus('loading');
        const response = await axiosPrivate.delete(`/delete-product/${id}`, {
        });
        console.log(response.data)
        let newDataProduct = data.filter(item => item._id !== id)
        setData(newDataProduct);
        setTitle('Product deleted');
        setMessage(`Product ${name} has been deleted`)
        setStatus('done');
      } catch (err) {
        console.log(err?.response?.data || err.message);
      } 
    }
    setClickYes(() => newClickYes);
    setVisible(true);
  } 
  const [value, onChangeText] = useState("");

  const moveItemDetail = async (item) => {
    const dataArray = [];
    const size = [];
    const controller = new AbortController();
    const getDetailByProductId = async () => {
      try {
        const response = await axiosPrivate.get(
          `/get-detail-by-productId/${item._id}`,
          {
            signal: controller.signal,
          },
        );


        response.data.map(item => {
          let sizeObj = size.find(size => size === item.sizeName);
          if (!sizeObj) {
            size.push(item.sizeName);
          }
        });
        response.data.map(item => {
          let colorObj = dataArray.find(q => q.color === item.colorName);
          if (!colorObj) {
            colorObj = {color: item.colorName};
            size.map(itemSize => {
              colorObj = {...colorObj, [itemSize]: 0};
            });
            console.log(colorObj);
            dataArray.push(colorObj);
          }

          size.map(itemSize => {
            if (itemSize === item.sizeName) {
              colorObj[itemSize] = item.quantity;
            }
            console.log(colorObj[itemSize]);
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
    await getDetailByProductId();
    props.navigation.navigate("ItemDetail",{data: item, size, productDetail: dataArray})
  }
  const windowWidth = Dimensions.get('window').width;
  return (
    <SafeAreaView style={styles.container}>
       <MessageYN 
          visible={visible} 
          title={title}
          message={message}
          clickYes={clickYes}
          clickNo={clickNo}
          status={status}
          clickCancel={() => {setVisible(false)}}
        />
        <View style={styles.header}>
        
          <View style={styles.viewText}>
            <View style={styles.viewTitleText}>
              <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                  <IC_Backward stroke={color.White}/>
              </TouchableOpacity>
              <Text style={styles.textTile}>List of items</Text>
            </View>
              <View style={styles.viewTextAndSearch}>
                    <TouchableOpacity style={styles.viewTextLabel} onPress={()=>props.navigation.navigate("AddItem")}>
                      <Text style={styles.textLabel}>Add item</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.viewSearch}> 
                          <TextInput style={styles.textInput}
                            placeholder="Search ..."
                            placeholderTextColor={color.AthensGray}
                            editable
                            numberOfLines={1}
                            maxLength={40}
                            onChangeText={text => onChangeText(text)}
                            keyboardType='ascii-capable'
                            value={value}
                          >

                          </TextInput>
                          <View style={styles.viewIcon}>
                            <IC_Search stroke = {color.White}/>
                          </View>

                    </View> */}
              </View>
          </View>
        </View>
        {loading && <Progress.Bar
                indeterminate={true} 
                width={windowWidth} 
                borderRadius={0} 
                color={color.Secondary} 
                borderWidth={0} 
                height={3}/>}
        <View style={styles.body}>
            <FlatList
              data={data}
              removeClippedSubviews={true}
              maxToRenderPerBatch={8}
              windowSize={11}
              initialNumToRender={8}
              keyExtractor={item => item._id}
              renderItem={({item, index}) => (
                <Item
                  key={item._id}
                  number={index+1}                
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  sale= {item.sale}
                  source = {item.posterImage.url}
                  onPress={() => moveItemDetail(item)}
                  delete={()=>deleteItem(item._id,item.name)}
                  onPressEdit={() => pressEdit(item)}
                  />
              )}
            />
        </View>
    </SafeAreaView>
  )
}

export default ListOfItemScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      header: {
        height: Dimensions.get('screen').height*0.25,
        backgroundColor: color.TitleActive,
        elevation: 1,
        justifyContent: 'flex-end',
        paddingBottom: scale(20),

      },
      viewTitleText:{
        flexDirection: 'row',
        alignItems: 'center'
      },
      textTile: {
        color: color.White,
        fontSize: 36,
        fontFamily: FONT_FAMILY.Bold,
      },
      viewTextAndSearch:{
        flexDirection: 'row',
        marginTop: scale(10),
        alignItems: 'center',
        justifyContent: 'space-between',

      },
      viewTextLabel:{
        backgroundColor: color.Alto,
        width: scale(122),
        height: scale(36),
        alignItems: 'center',
        marginLeft: scale(30)

      },
      textLabel: {
        color: color.TitleActive,
        fontSize: 24,
        fontFamily: FONT_FAMILY.Bold,
      },
      viewSearch:{
        flexDirection: 'row',
        alignItems: 'center',
        width: scale(166),
        marginRight: scale(20),
        borderWidth: 1,
        borderColor: color.White,
      },
      textInput:{
        width: '70%',
        color: color.White,

      },
      viewIcon:{
        width: '30%',
        alignItems: 'center'
      },
      body:{
        flex: 1,
        backgroundColor: color.White,
      },
      
})