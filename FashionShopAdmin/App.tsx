import { View, Text, LogBox } from 'react-native'
import React from 'react'
import MyNavigationContainer from './src/router/navigationContainer'
import { AuthProvider } from './src/context/AuthProvider'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs();

LogBox.ignoreAllLogs();
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MyNavigationContainer/>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

export default App;