import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignIn from './SignIn';
import Main from './Main';
import Credit from './Credit';
import SignOut from './SignOut';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';


const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

function MyDrawer() {
  
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Main} />
      <Drawer.Screen name="Credit" component={Credit} />
      <Drawer.Screen name="SignOut" component={SignOut} />
    </Drawer.Navigator>
  );
}

export default function App() {

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='sign-in'>
          <Stack.Screen name="sign-in" component={SignIn} />
          <Stack.Screen name="myDrawer" component={MyDrawer} options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="main" component={Main} />
          <Stack.Screen name="credit" component={Credit} />
          <Stack.Screen name="sign-out" component={SignOut} />
        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    
  );

}