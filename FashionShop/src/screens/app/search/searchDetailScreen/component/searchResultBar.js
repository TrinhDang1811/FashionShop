import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import scale from '../../../../../constants/responsive';
import color from '../../../../../constants/color';
import {IC_Delete, IC_Search} from '../../../../../assets/icons';

const SearchResultBar = () => {
  const [searchContent, setSearchContent] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        ref={input => {
          this.textInput = input;
        }}
        onChangeText={text => setSearchContent(text)}
        selectionColor={color.GraySolid}
        placeholder="Search"
        placeholderTextColor={color.GraySolid}
        style={{
          height: scale(42),
          color: color.TitleActive,
          top: scale(2),
          width: scale(280),
        }}
      />
      <TouchableOpacity
        onPress={() => setSearchContent('') & this.textInput.clear()}>
        <IC_Delete marginRight={scale(10)} />
      </TouchableOpacity>
      <TouchableOpacity>
        <IC_Search marginRight={scale(20)} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchResultBar;

const styles = StyleSheet.create({
  container: {
    marginTop: scale(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderBottomColor: color.GraySolid,
    borderBottomWidth: 1,
  },
});
