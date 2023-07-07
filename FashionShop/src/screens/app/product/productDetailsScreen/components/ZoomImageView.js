import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import SwiperFlatList from 'react-native-swiper-flatlist';
import scale from '../../../../../constants/responsive';
import color from '../../../../../constants/color';
import {IC_Delete} from '../../../../../assets/icons';

const ZoomImageView = props => {
  const [sHeight, setSHeight] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.productContainer}>
        <TouchableOpacity
          onPress={props.onPressVisible}
          style={{alignSelf: 'flex-end', padding: scale(10)}}>
          <IC_Delete />
        </TouchableOpacity>
        <View
          style={{flex: 1}}
          onLayout={event => {
            var {x, y, width, height} = event.nativeEvent.layout;
            setSHeight(height);
          }}>
          <SwiperFlatList
            vertical={true}
            showPagination
            paginationStyle={styles.wrapDot}
            paginationStyleItemActive={styles.dotActive}
            paginationStyleItemInactive={styles.dot}
            paginationDefaultColor={color.TitleActive}
            paginationActiveColor={color.Primary}
            data={props.productImages}
            renderItem={({item}) => (
              <View
                style={{
                  width: Dimensions.get('window').width,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: sHeight,
                }}
                key={item => `${item.key}`}>
                <View style={styles.imgContainer}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.img}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ZoomImageView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.TitleActive,
  },
  productContainer: {
    flex: 1,
  },
  wrapDot: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
    width: '100%',
    top: scale(250),
    left: scale(350),
  },
  dotActive: {
    marginVertical: scale(3),
    size: 3,
    width: scale(7),
    height: scale(7),
  },
  dot: {
    marginVertical: scale(3),
    opacity: 0.27,
    size: 3,
    width: scale(7),
    height: scale(7),
  },
  imgContainer: {
    width: '100%',
    height: scale(500),
  },
  img: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    // height: scale(500),
    height: '100%',
  },
});
