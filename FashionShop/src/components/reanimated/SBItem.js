import React, {useState} from 'react';
import {StyleProp, ViewStyle, View, StyleSheet} from 'react-native';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
import {SBImageItem} from './SBImageItem';
import {SBTextItem} from './SBTextItem';

import Animated from 'react-native-reanimated';
import scale from '../../constants/responsive';
import Custom_HomepageProd from '../products/CustomHomepageProd';

const {ViewProps} = Animated;

export const SBItem = props => {
  const [isPretty, setIsPretty] = useState(props.pretty || false);
  const enablePretty = true;
  const item = props.item;
  const navigation = props.navigation;
  console.log('hihi', item);

  const {style, index, testID, ...animatedViewProps} = props;

  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty);
      }}>
      <View testID={testID} style={{flex: 1}} {...animatedViewProps}>
        {isPretty ? (
          <SBImageItem
            style={style}
            index={index}
            item={item}
            showIndex={typeof index === 'number'}
          />
        ) : (
          <View key={item => `${item._id}`} style={styles.productWrap}>
            <Custom_HomepageProd
              height={300}
              width={245}
              image={item.posterImage.url}
              prodName={item.name}
              prodPrice={item.price}
              onPress={() =>
                navigation.navigate('ProductStackScreen', {
                  screen: 'ProductDetailsScreen',
                  params: {data: item},
                })
              }
            />
          </View>
        )}
      </View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  productWrap: {
    justifyContent: 'space-around',
    height: scale(460),
    alignItems: 'center',
    flexDirection: 'column',
  },
});
