import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import color from '../../../../constants/color';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Custom_GridViewProd from '../../../../components/products/CustomGridViewProd';
import Custom_Footer from '../../../../components/footer/Custom_Footer';
import Filter from '../../../../components/buttons/filter';
import Custom_Tag2 from '../../../../components/tags/border';

const CategoryGridViewByIdScreen = props => {
  const {data} = props.route.params;
  // console.log(data)
  const [product, setProduct] = useState([]);
  const [categoryParentName, setCategoryParentName] = useState();
  const [categoryParentNameBool, setCategoryParentNameBool] = useState(false);
  const [page, setPage] = useState(1);
  const [productPage, setProductPage] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const controller = new AbortController();

    const getProductsByTag = async id => {
      try {
        const response = await axiosPrivate.get(
          `/get-product-by-tag-id/${id}`,
          {
            signal: controller.signal,
          },
        );
        setProduct(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    const getProductsByCategory = async (id, parentId) => {
      try {
        const response = await axiosPrivate.get(
          `/get-product-by-category-id/${id}`,
          {
            signal: controller.signal,
          },
        );
        const responseParent = await axiosPrivate.get(`/category/${parentId}`, {
          signal: controller.signal,
        });
        setProduct(response.data);
        setCategoryParentName(responseParent.data.name);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (!data.parentId) getProductsByTag(data._id);
    else {
      getProductsByCategory(data._id, data.parentId);
      setCategoryParentNameBool(true);
    }
    return () => {
      controller.abort();
    };
  }, [data]);

  useEffect(() => {
    arrangeProducts(filterValue);
    setProductPage(product.slice(0, 8));
  }, [product, filterValue]);

  const handleLoadMore = () => {
    setPage(page + 1);
    const newData = product.slice(productPage, 8 * page);
    setProductPage(newData);
  };
  const TextUpperCase = text => {
    let newText = '' + text;
    return newText?.toUpperCase();
  };

  const arrangeProducts = value => {
    setFilterValue(value);
    switch (filterValue) {
      case 'highest':
        setProduct(product.sort((a, b) => b.price - a.price));
        setProductPage(product.slice(0, 8 * page));
        break;
      case 'lowest':
        setProduct(product.sort((a, b) => a.price - b.price));
        setProductPage(product.slice(0, 8 * page));
        break;
    }
  };

  const renderItem = ({item}) => (
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
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.resultSum}>
        <View style={styles.sumText}>
          {categoryParentNameBool ? (
            <Text style={styles.textCategory}>
              {TextUpperCase(categoryParentName) +
                ' > ' +
                TextUpperCase(data.name)}
            </Text>
          ) : (
            <View>
              <Custom_Tag2 value={'#' + data.name} />
            </View>
          )}
          <Filter onSortChange={arrangeProducts} selectedValue={filterValue} />
        </View>
      </View>
      <ScrollView style={styles.list}>
        <View style={styles.likeProductContainer}>
          <FlatList
            contentContainerStyle={{
              alignContent: 'space-around',
              marginTop: scale(20),
            }}
            horizontal={false}
            data={productPage}
            keyExtractor={item => `${item._id}`}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.wrapperLikeProducts}
            renderItem={renderItem}
          />
          {product.length > productPage.length && (
            <TouchableOpacity style={styles.button} onPress={handleLoadMore}>
              <Text style={styles.text}>Load more</Text>
            </TouchableOpacity>
          )}
        </View>
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
export default CategoryGridViewByIdScreen;

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
  text: {
    fontWeight: '700',
    fontSize: scale(24),
    textAlign: 'center',
    color: color.White,
    fontFamily: FONT_FAMILY.Regular,
  },
  textCategory: {
    fontWeight: '400',
    fontSize: scale(14),
    textAlign: 'center',
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
  },
  resultSum: {
    marginTop: scale(30),
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: scale(15),
    width: '100%',
    justifyContent: 'space-between',
  },
  sumText: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  sum: {
    fontWeight: '400',
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
});
