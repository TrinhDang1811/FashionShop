import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import LinearGradient from 'react-native-linear-gradient';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import color from '../../../../../constants/color';
import fontStyles from '../../../../../constants/fontStyle';
import Custom_Tag2 from '../../../../../components/tags/border';
import Custom_Tag1 from '../../../../../components/tags/fill';

const BlogItems = props => {
  const [tags, setTags] = useState([]);
  const axiosPrivate = useAxiosPrivate();
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
    getTags(props.tagId);
    return () => {
      controller.abort();
    };
  }, []);
  console.log(JSON.stringify(tags));
  return (
    <View
      style={{
        flexDirection: 'column',
        marginTop: scale(20),
        width: scale(320),
      }}>
      <TouchableOpacity style={styles.container} onPress={props.blogOnPress}>
        <View style={styles.imgContainer}>
          <Image
            source={{uri: props.image}}
            style={styles.img}
            resizeMode="cover"
          />
        </View>
        <LinearGradient
          style={styles.textContainer}
          colors={['#00000000', '#000000']}>
          <Text style={[fontStyles.subTitle14pxFont, styles.prodName]}>
            {props.prodName}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.tagContainer}
        horizontal={true}
        data={tags}
        keyExtractor={item => `${item._id}`}
        scrollEnabled={false}
        renderItem={({item}) => (
          <Custom_Tag2
            onPress={() =>
              props.navigation.navigate('CategoryGridViewByIdScreen', {
                data: item,
              })
            }
            value={'#' + item.name}
            marginLeft={scale(10)}
            visible={false}
          />
        )}
      />
    </View>
  );
};

export default BlogItems;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(320),
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: scale(10),
    justifyContent: 'center',
    height: scale(40),
    borderWidth: 1,
  },
  imgContainer: {
    width: scale(320),
    alignSelf: 'center',
  },
  img: {
    width: scale(320),
    height: scale(400),
  },
  textContainer: {
    position: 'absolute',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    bottom: scale(0),
    marginLeft: scale(14),
    paddingHorizontal: scale(3),
    width: scale(320),
    height: scale(90),
  },
  prodName: {
    color: color.OffWhite,
    fontFamily: FONT_FAMILY.Regular,
    letterSpacing: scale(2),
    fontWeight: '600',
    textAlign: 'center',
    top: scale(13),
  },
});
