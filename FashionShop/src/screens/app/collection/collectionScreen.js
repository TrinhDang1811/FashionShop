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
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Custom_Footer from '../../../components/footer/Custom_Footer';
import CollectionItems from './components/collectionItems';
import scale from '../../../constants/responsive';
import color from '../../../constants/color';
import FONT_FAMILY from '../../../constants/fonts';

const CollectionScreen = props => {
  const [collectionData, setCollectionData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();

    const getCollections = async () => {
      try {
        const response = await axiosPrivate.get('/get-all-collection', {
          signal: controller.signal,
        });
        console.log(response.data);
        setCollectionData(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };

    getCollections();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Collection */}
      <View style={{backgroundColor: color.TitleActive}}>
        <Text style={styles.collectionText}>COLLECTION</Text>
      </View>
      <ScrollView>
        <View style={styles.collectionContainer}>
          <FlatList
            contentContainerStyle={{
              justifyContent: 'space-between',
              marginVertical: scale(20),
            }}
            horizontal={false}
            data={collectionData}
            keyExtractor={item => `${item._id}`}
            scrollEnabled={false}
            renderItem={({item, index}) => (
              <CollectionItems
                image={item.posterImage.url}
                prodName={item.name}
                prodNumber={index + 1}
                onPress={() =>
                  props.navigation.navigate('CollectionDetailScreen', {
                    data: item,
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
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.OffWhite,
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
    paddingHorizontal: scale(16),
    backgroundColor: color.TitleActive,
  },
  collectionText: {
    fontSize: scale(24),
    lineHeight: scale(40),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Italic,
    color: color.OffWhite,
  },
});
