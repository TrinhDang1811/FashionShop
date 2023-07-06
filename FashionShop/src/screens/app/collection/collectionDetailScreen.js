import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import CollectionProduct from './components/collectionProducts';
import SuggestiveCollection from './components/suggestiveCollections';
import Custom_Footer from '../../../components/footer/Custom_Footer';
import scale from '../../../constants/responsive';
import color from '../../../constants/color';
import FONT_FAMILY from '../../../constants/fonts';

const CollectionDetailScreen = props => {
  const {data} = props.route.params;
  console.log(data);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [suggestiveCollection, setSuggestiveCollection] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const controller = new AbortController();

    const getSuggestiveCollection = async number => {
      try {
        const response = await axiosPrivate.get(
          `/get-random-collection/${number}`,
          {
            signal: controller.signal,
          },
        );
        setSuggestiveCollection(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    const getCollectionProducts = async idList => {
      const listOfProduct = [];
      await Promise.all(
        idList.map(async id => {
          try {
            const response = await axiosPrivate.get(
              `/get-product-by-id/${id}`,
              {
                signal: controller.signal,
              },
            );
            listOfProduct.push(response.data);
          } catch (err) {
            console.log(err.response.data);
          }
        }),
      );
      setCollectionProducts(listOfProduct);
    };
    getCollectionProducts(data.productId);
    getSuggestiveCollection(4);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Collection */}
      <ScrollView>
        <View style={{backgroundColor: color.TitleActive}}>
          <Text style={styles.nameCollectionText}>{data.name}</Text>
          <Text style={styles.collectionText}>COLLECTION</Text>
          <View style={styles.imgContainer}>
            <Image
              source={{uri: `${data.posterImage.url}`}}
              style={styles.img}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.collectionContainer}>
          <FlatList
            contentContainerStyle={{
              alignContent: 'space-around',
              marginTop: scale(20),
            }}
            horizontal={false}
            data={collectionProducts}
            keyExtractor={item => `${item._id}`}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{marginBottom: scale(10)}}
            renderItem={({item}) => (
              <CollectionProduct
                image={item.posterImage.url}
                prodName={item.name}
                prodPrice={item.price}
                onPress={() =>
                  props.navigation.replace('ProductDetailsScreen', {
                    data: item,
                  })
                }
              />
            )}
          />
        </View>
        {/* You May Also Like */}
        <View style={styles.likeProductContainer}>
          <Text style={styles.likeProductText}>YOU MAY ALSO LIKE</Text>
          <Text style={styles.line}>━━━━━━━━◆━━━━━━━━</Text>
          <FlatList
            contentContainerStyle={{
              alignContent: 'space-around',
              marginTop: scale(20),
            }}
            data={suggestiveCollection}
            horizontal={true}
            keyExtractor={item => `${item._id}`}
            renderItem={({item}) => (
              <SuggestiveCollection
                onPress={() =>
                  props.navigation.replace('CollectionDetailScreen', {
                    data: item,
                  })
                }
                image={item.posterImage.url}
                prodName={item.name}
                prodDescription={item.description}
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
  );
};

export default CollectionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.OffWhite,
  },
  imgContainer: {
    height: scale(300),
    marginHorizontal: scale(16),
  },
  img: {
    width: '100%',
    height: scale(300),
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
  collectionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(10),
    backgroundColor: color.TitleActive,
  },
  collectionText: {
    fontSize: scale(16),
    lineHeight: scale(16),
    letterSpacing: scale(3),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    color: color.OffWhite,
  },
  nameCollectionText: {
    fontSize: scale(30),
    lineHeight: scale(40),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Italic,
    color: color.OffWhite,
  },
  likeProductContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(32),
    paddingHorizontal: scale(16),
    backgroundColor: color.TitleActive,
  },
  likeProductText: {
    fontSize: scale(18),
    lineHeight: scale(36),
    letterSpacing: scale(4),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    color: color.OffWhite,
  },
  lineBottom: {
    alignSelf: 'center',
  },
  line: {
    color: color.OffWhite,
    opacity: 0.4,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(10),
    lineHeight: scale(10),
    alignSelf: 'center',
    textAlign: 'center',
  },
});
