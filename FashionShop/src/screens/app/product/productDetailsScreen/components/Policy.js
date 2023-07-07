import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import React, {useState} from 'react';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import color from '../../../../../constants/color';
import {IC_Up, IC_Tag, IC_Down, IC_Refresh} from '../../../../../assets/icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const Accordion = ({title, children}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <>
      <TouchableOpacity
        onPress={toggleOpen}
        style={styles.viewList}
        activeOpacity={0.6}>
        {title}
        <View style={styles.viewIcon}>
          {!isOpen ? <IC_Down></IC_Down> : <IC_Up></IC_Up>}
        </View>
      </TouchableOpacity>
      <View style={[styles.list, !isOpen ? styles.hidden : undefined]}>
        {children}
      </View>
    </>
  );
};
const Policy = props => {
  const title = (
    <View style={styles.viewTextList}>
      <IC_Tag />
      <Text style={styles.textList}> COD Policy</Text>
    </View>
  );
  const body = (
    <View>
      <View style={styles.viewTextList2}>
        <Text style={styles.textList2}>Shipment processing time</Text>
        <Text numberOfLines={8} style={styles.textListBody}>
          All orders are processed within 3 to 5 days. Orders are not shipped or
          delivered on weekends or holidays. If we are experiencing a high
          volume of orders, shipments may be delayed by a few days. Please allow
          additional days in transit for delivery. If there will be a
          significant delay in shipment of your order, we will contact you via
          email or telephone.
        </Text>
      </View>
      <View style={styles.viewTextList2}>
        <Text style={styles.textList2}>Damages or Mistaken</Text>
        <Text numberOfLines={8} style={styles.textListBody}>
          We are so sorry for this problem. When you received your order, please
          filming the open process, then send us via email. We will check it and
          send you another one.
        </Text>
      </View>
    </View>
  );
  const title2 = (
    <View style={styles.viewTextList}>
      {/* <View style={styles.icon}>
      </View> */}
      <IC_Refresh />
      <Text style={styles.textList}> Return Policy</Text>
    </View>
  );
  const body2 = (
    <View>
      <View style={styles.viewTextList2}>
        <Text numberOfLines={4} style={styles.textListBody}>
          We only accept return the order before 4 days from the shipped day and
          the item still has full tag. We do not accept return for sale items.
        </Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        {/* <ScrollView> */}
        {/* COD Policy */}
        <Accordion title={title}>{body}</Accordion>
        <View
          style={{
            borderBottomWidth: 1,
            height: 0,
            borderColor: color.Border,
          }}></View>
        <Accordion title={title2}>{body2}</Accordion>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.OffWhite,
    flex: 1,
  },
  body: {
    flex: 0.6,
    backgroundColor: color.OffWhite,
  },
  viewList: {
    height: scale(68),
    width: '100%',
    flexDirection: 'row',
  },
  viewList2: {
    height: scale(68),
    width: '100%',
    flexDirection: 'row',
  },
  viewTextList: {
    justifyContent: 'center',
    width: scale(350),
    marginLeft: scale(-110),
    marginTop: scale(20),
    flexDirection: 'row',
  },
  viewTextList2: {
    justifyContent: 'center',
    // width: scale(350),
  },
  textList: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 16,
    fontWeight: '400',
    color: color.TitleActive,
  },
  textList2: {
    fontFamily: FONT_FAMILY.BoldSecond,
    fontSize: scale(18),
    color: color.TitleActive,
  },
  viewIcon: {
    alignSelf: 'center',
    marginLeft: scale(70),
  },
  viewListBody: {
    height: scale(48),
    width: '100%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: color.White,
    opacity: 0.5,
  },
  textListBody: {
    marginTop: scale(5),
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
    color: color.TitleActive,
    marginLeft: scale(20),
  },
  hidden: {
    height: 0,
  },
  list: {
    overflow: 'hidden',
  },
});
