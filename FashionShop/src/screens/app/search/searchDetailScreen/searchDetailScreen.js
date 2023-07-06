import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Custom_GridViewProd from '../../../../components/products/CustomGridViewProd';
import Custom_Footer from '../../../../components/footer/Custom_Footer';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import color from '../../../../constants/color';
import {IC_Delete, IC_Search} from '../../../../assets/icons';

const SearchDetailScreen = props => {
  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const [searchContent, setSearchContent] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const controller = new AbortController();

    const getProducts = async () => {
      try {
        const response = await axiosPrivate.get('/get-all-product ', {
          signal: controller.signal,
        });
        setAllProducts(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    getProducts();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    arrangeProducts(filterValue);
    setData(searchResult.slice(0, 8));
  }, [searchResult, filterValue]);

  const handleLoadMore = () => {
    setPage(page + 1);
    const newData = searchResult.slice(data, 8 * page);
    setData(newData);
  };
  const searchFilterFunction = text => {
    if (text) {
      const newData = allProducts.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchResult(newData);
      console.log(searchResult);
      setSearchContent(text);
    } else {
      setSearchResult([]);
      setData([]);
      setSearchContent(text);
    }
  };

  const arrangeProducts = value => {
    setFilterValue(value);
    switch (filterValue) {
      case 'highest':
        setSearchResult(searchResult.sort((a, b) => b.price - a.price));
        setData(searchResult.slice(0, 8 * page));
        break;
      case 'lowest':
        setSearchResult(searchResult.sort((a, b) => a.price - b.price));
        setData(searchResult.slice(0, 8 * page));
        break;
    }
  };

  const renderItem = ({item}) => (
    <Custom_GridViewProd
      image={item.posterImage.url}
      prodName={item.name}
      prodPrice={item.price}
      onPress={() =>
        props.navigation.navigate('ProductDetailsScreen', {
          data: item,
        })
      }
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          ref={input => {
            this.textInput = input;
          }}
          onChangeText={text => searchFilterFunction(text)}
          selectionColor={color.GraySolid}
          placeholder="Search"
          placeholderTextColor={color.GraySolid}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => searchFilterFunction('') & this.textInput.clear()}>
          <IC_Delete marginRight={scale(10)} />
        </TouchableOpacity>
        <TouchableOpacity>
          <IC_Search marginRight={scale(20)} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {searchResult.length === 0 ? (
          <View
            style={{
              justifyContent: 'center',
              marginTop: scale(140),
              marginBottom: scale(187),
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.Bold,
                fontSize: scale(24),
                color: color.TitleActive,
                textAlign: 'center',
              }}>
              LET'S SEARCH!
            </Text>
          </View>
        ) : (
          <View style={styles.likeProductContainer}>
            <FlatList
              contentContainerStyle={{
                alignContent: 'space-around',
                marginTop: scale(20),
              }}
              horizontal={false}
              data={data}
              keyExtractor={item => `${item._id}`}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.wrapperLikeProducts}
              renderItem={renderItem}
            />
            {searchResult.length > data.length && (
              <TouchableOpacity style={styles.button} onPress={handleLoadMore}>
                <Text style={styles.text}>Load more</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <Custom_Footer
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
  );
};
export default SearchDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.OffWhite,
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    width: scale(295),
    height: scale(61),
    marginTop: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.TitleActive,
  },
  searchBar: {
    marginTop: scale(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderBottomColor: color.GraySolid,
    borderBottomWidth: 1,
  },
  text: {
    fontWeight: '700',
    fontSize: scale(24),
    textAlign: 'center',
    color: color.White,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  resultSum: {
    marginTop: scale(20),
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: scale(10),
  },
  sum: {
    fontWeight: '400',
    fontSize: scale(16),
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  newTag: {
    backgroundColor: color.AthensGray,
    borderRadius: scale(33),
    justifyContent: 'center',
    alignItems: 'center',
  },
  new: {
    fontWeight: '400',
    marginLeft: scale(-10),
    fontSize: scale(13),
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  iconDown: {
    marginLeft: scale(40),
    justifyContent: 'center',
    marginTop: scale(-15),
  },
  filterBorder: {
    marginLeft: scale(180),
    width: scale(36),
    height: scale(36),
    backgroundColor: color.AthensGray,
    borderRadius: scale(180),
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: scale(10),
    zIndex: -1,
  },
  likeProductContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  likeProductText: {
    fontSize: scale(18),
    lineHeight: scale(40),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    color: color.TitleActive,
  },
  productWrap: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  wrapperLikeProducts: {
    marginBottom: scale(5),
  },
  button: {
    width: scale(295),
    height: scale(61),
    marginTop: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.TitleActive,
  },
  searchBar: {
    marginTop: scale(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderBottomColor: color.GraySolid,
    borderBottomWidth: 1,
  },
  text: {
    fontWeight: '700',
    fontSize: scale(24),
    textAlign: 'center',
    color: color.White,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  resultSum: {
    marginTop: scale(20),
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: scale(20),
    justifyContent: 'space-evenly',
  },
  sum: {
    fontSize: scale(16),
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
  },
  newTag: {
    backgroundColor: color.AthensGray,
    borderRadius: scale(33),
    justifyContent: 'center',
    alignItems: 'center',
  },
  new: {
    fontWeight: '400',
    marginLeft: scale(-10),
    fontSize: scale(13),
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.JoseFinSansRegular,
  },
  iconDown: {
    marginLeft: scale(40),
    justifyContent: 'center',
    marginTop: scale(-15),
  },
  filterBorder: {
    marginLeft: scale(180),
    width: scale(36),
    height: scale(36),
    backgroundColor: color.AthensGray,
    borderRadius: scale(180),
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: scale(10),
    zIndex: -1,
  },
  likeProductContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  likeProductText: {
    fontSize: scale(18),
    lineHeight: scale(40),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    color: color.TitleActive,
  },
  productWrap: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  wrapperLikeProducts: {
    marginBottom: scale(5),
  },
  textInput: {
    height: scale(42),
    color: color.TitleActive,
    top: scale(2),
    width: scale(280),
    fontFamily: FONT_FAMILY.Regular,
  },
});
