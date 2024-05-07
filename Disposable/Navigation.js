import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/Home';
import CameraScreen from './Screens/Camera';
import GalleryScreen from './Screens/Gallery';
import SettingsScreen from './Screens/Settings';
import CreatePage from './Screens/Create';
import JoinPage from './Screens/Join';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();
const GalleryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab">
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="HomeScreen" component={HomeScreen}/>
              <HomeStack.Screen name="CreatePage" component={CreatePage}/>
              <HomeStack.Screen name="JoinPage" component={JoinPage}/>
            </HomeStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="CameraTab">
          {() => (
            <CameraStack.Navigator>
              <CameraStack.Screen name="CameraScreen" component={CameraScreen} />
            </CameraStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="GalleryTab">
          {() => (
            <GalleryStack.Navigator>
              <GalleryStack.Screen name="GalleryScreen" component={GalleryScreen} />
              <GalleryStack.Screen name="CameraScreen" component={CameraScreen} />
            </GalleryStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="SettingsTab">
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
