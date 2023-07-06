import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import scale from '../../../../../constants/responsive';
import FONT_FAMILY from '../../../../../constants/fonts';
import color from '../../../../../constants/color';

const Popup = props => {
  return (
    <View style={styles.container}>
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>Choose an option</Text>
      </View>
      <TouchableOpacity
        style={styles.viewPopUpLeft}
        onPress={props.onPressUpload}>
        <View style={styles.viewTextPopUp}>
          <Text style={styles.textPopUp}>Gallery</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewPopUpRight}
        onPress={props.onPressCamera}>
        <View style={styles.viewTextPopUp}>
          <Text style={styles.textPopUp}>Take a photo</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Popup;

const styles = StyleSheet.create({
  container: {
    marginTop: scale(35),
    width: '100%',
    height: '100%',
    backgroundColor: color.White,
    marginLeft: 0,
    // alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    //flex: 0.3,
  },
  viewTitle: {
    height: '20%',
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    color: color.Secondary,
    fontFamily: FONT_FAMILY.Bold,
    fontWeight: '700',
    fontSize: 16,
  },
  viewPopUpLeft: {
    height: '40%',
    borderTopWidth: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.Border,
  },
  viewPopUpRight: {
    height: '40%',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.Border,
  },
  viewTextPopUp: {
    width: scale(139),
    height: scale(90),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPopUp: {
    fontSize: 16,
    color: color.TitleActive,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.7,
  },
});
