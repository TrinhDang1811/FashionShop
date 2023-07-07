import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useMemo} from 'react';
import scale from '../../constants/responsive';
import color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';
import {IC_Filter} from '../../assets/icons';
import {RadioButton} from 'react-native-paper';

const Filter = props => {
  const [onPress, setOnPress] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.filterBorder}>
        <TouchableOpacity
          onPress={() => setOnPress(onPress === true ? false : true)}>
          <IC_Filter stroke={'#DD8560'} />
        </TouchableOpacity>
      </View>
      {onPress ? (
        <View style={styles.filterContainer}>
          <RadioButton.Group
            onValueChange={value => props.onSortChange(value)}
            value={props.selectedValue}>
            <View style={styles.row}>
              <RadioButton value="lowest" color={color.Purple} />
              <Text style={styles.text}>Lowest to highest</Text>
            </View>
            <View style={styles.row}>
              <RadioButton value="highest" color={color.Purple} />
              <Text style={styles.text}>Highest to lowest</Text>
            </View>
          </RadioButton.Group>
        </View>
      ) : null}
    </View>
  );
};
export default Filter;
const styles = StyleSheet.create({
  container: {
    // width: scale(80),
    // marginLeft:scale(30)
  },
  filterBorder: {
    marginLeft: scale(160),
    padding: scale(9),
    // width: scale(36),
    // height: scale(36),
    backgroundColor: color.AthensGray,
    borderRadius: scale(180),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginTop: scale(40),
    width: scale(200),
    height: scale(120),
    backgroundColor: color.AthensGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'absolute',
    borderRadius: scale(20),
  },
  text: {
    fontSize: scale(17),
    textAlign: 'center',
    color: color.Secondary,
    fontFamily: FONT_FAMILY.Regular,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
