import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailsScreen from './components/productDetailsScreen';
import ProductRatingScreen from './components/productRatingScreen';

const ProductStack = createNativeStackNavigator();

export const ProductStackScreen = props => {
  return (
    <ProductStack.Navigator
      initialRouteName="ProductDetailsScreen"
      screenOptions={{headerShown: false}}>
      <ProductStack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={{headerShown: false}}
      />
      <ProductStack.Screen
        name="ProductRatingScreen"
        component={ProductRatingScreen}
        options={{headerShown: false}}
      />
    </ProductStack.Navigator>
  );
};
