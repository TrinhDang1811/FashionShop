import React from 'react';
import RootNavigator from './src/routes/RootNavigation';
import {AuthProvider} from './src/context/AuthProvider';
import {LogBox} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs();

const App = (props: any) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator {...props} />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
