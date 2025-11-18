import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppScreen from './index'; // 기존 src/app/App.tsx (RN 버전으로 바꿔둔 것)

export type RootStackParamList = {
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="App"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="App" component={AppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
