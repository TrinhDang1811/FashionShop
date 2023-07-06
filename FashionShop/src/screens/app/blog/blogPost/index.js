import {
  SafeAreaView,
  StyleSheet,
  Text,
  Dimensions,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SwiperFlatList from 'react-native-swiper-flatlist';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import scale from '../../../../constants/responsive';
import FONT_FAMILY from '../../../../constants/fonts';
import Custom_Footer from '../../../../components/footer/Custom_Footer';
import Custom_Tag2 from '../../../../components/tags/border';
import color from '../../../../constants/color';

const BlogPostScreen = props => {
  const {data} = props.route.params;
  const [tags, setTags] = useState([]);
  const [blogImages, setBlogImages] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const getBlogImages = async () => {
      const listOfBlogImages = [];
      await Promise.all(
        data.image.map(async image => {
          listOfBlogImages.push({id: image._id, image: image.url});
        }),
      );
      setBlogImages(listOfBlogImages);
    };
    getBlogImages();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getTags = async idList => {
      const listOfTags = [];
      await Promise.all(
        idList.map(async id => {
          try {
            const response = await axiosPrivate.get(`/get-tag-by-id/${id}`, {
              signal: controller.signal,
            });
            listOfTags.push(response.data);
          } catch (err) {
            console.log(err.response.data);
          }
        }),
      );
      setTags(listOfTags);
    };
    getTags(data.tag);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Image */}
        <Image
          source={{uri: data.posterImage.url}}
          resizeMode="stretch"
          style={{alignSelf: 'center', width: scale(300), height: scale(420)}}
        />
        {/* Blog title */}
        <View style={styles.bodyViewTop}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.Regular,
              fontSize: scale(18),
              textAlign: 'center',
              lineHeight: scale(18),
              textTransform: 'uppercase',
              color: color.TitleActive,
            }}>
            {data.title}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILY.Regular,
              fontSize: scale(14),
              lineHeight: scale(18),
              color: color.Body,
              marginTop: scale(10),
            }}>
            {data.detail.toLowerCase()}
          </Text>
        </View>
        {/* Image */}
        <View style={styles.imageContainer}>
          <SwiperFlatList
            showPagination
            paginationStyle={styles.wrapDot}
            paginationStyleItemActive={styles.dotActive}
            paginationStyleItemInactive={styles.dot}
            paginationDefaultColor={color.PlaceHolder}
            paginationActiveColor={color.TitleActive}
            data={blogImages}
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
                key={item => `${item.key}`}>
                <View style={styles.imgContainer}>
                  <Image
                    source={{uri: `${item.image}`}}
                    style={styles.img}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          />
        </View>
        {/* Blog title */}
        <View style={styles.bodyViewBottom}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.Regular,
              fontSize: scale(14),
              lineHeight: scale(18),
              color: color.Body,
              marginTop: scale(10),
            }}>
            {data.description.toLowerCase()}
          </Text>
        </View>
        {/* Post Date */}
        <View
          style={{
            flexDirection: 'row',
            marginLeft: scale(30),
            marginTop: scale(30),
            paddingBottom: scale(20),
          }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.Regular,
              fontSize: scale(14),
              lineHeight: scale(18),
              color: color.Body,
            }}>
            Posted by OpenFashion
          </Text>
        </View>
        <View style={styles.tagView}>
          {tags.map(item => (
            <Custom_Tag2
              {...props}
              onPress={() =>
                props.navigation.navigate('CategoryGridViewByIdScreen', {
                  data: item,
                })
              }
              key={item._id}
              value={'#' + item.name}
            />
          ))}
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
            props.navigation.replace('BlogStackScreen', {
              screen: 'BlogGridViewScreen',
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyViewTop: {
    flexDirection: 'column',
    marginTop: scale(30),
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: scale(15),
  },
  bodyViewBottom: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: scale(15),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(450),
    width: '100%',
  },
  wrapDot: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
  },
  dotActive: {
    marginHorizontal: scale(3),
    bottom: scale(5),
    width: scale(7),
    height: scale(7),
  },
  dot: {
    marginHorizontal: scale(3),
    bottom: scale(5),
    opacity: 0.27,
    size: 3,
    width: scale(7),
    height: scale(7),
  },
  imgContainer: {
    width: '95%',
    height: scale(450),
  },
  img: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: scale(380),
  },
  tagView: {
    flexDirection: 'row',
    paddingHorizontal: scale(30),
  },
});
