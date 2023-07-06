import {StyleSheet, Text, ScrollView, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import color from '../../../../../constants/color';
import Custom_UnderlineButton from './Custom_UnderlineButton';

const Custom_ItemScrollView = () => {
  const itemList = useMemo(
    () => ['All', 'Apparel', 'Dress', 'Tshirt', 'Bag'],
    [],
  );
  const [tab, setTab] = useState(itemList[0]);
  return (
    <ScrollView contentContainerStyle={{horizontal: true}} scrollEnabled={true}>
      <View style={styles.categoryView}>
        {itemList.map(item => (
          <View key={item}>
            <Custom_UnderlineButton
              isChoosing={tab === item}
              onPress={() => setTab(item)}
              textStyle={styles.categoryText(tab === item)}>
              {item}
            </Custom_UnderlineButton>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Custom_ItemScrollView;

const styles = StyleSheet.create({
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  categoryText: isChoosing => ({
    color: isChoosing ? color.TitleActive : color.PlaceHolder,
    fontSize: scale(17),
    fontFamily: FONT_FAMILY.Regular,
  }),
});
