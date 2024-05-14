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
import HallPage from './Screens/Hall';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();
const GalleryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home">
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Disposable' }}/>
              <HomeStack.Screen name="CreatePage" component={CreatePage} options={{ title: 'Create an event' }}/>
              <HomeStack.Screen name="JoinPage" component={JoinPage} options={{ title: 'Join an event' }}/>
              <HomeStack.Screen name="HallPage" component={HallPage} options={{ title: 'Event Hall' }}/>

            </HomeStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Camera">
          {() => (
            <CameraStack.Navigator>
              <CameraStack.Screen name="CameraScreen" component={CameraScreen} options={{title: 'Camera'}} />
            </CameraStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Gallery">
          {() => (
            <GalleryStack.Navigator>
              <GalleryStack.Screen name="GalleryScreen" component={GalleryScreen} options={{title: 'Galleries'}}/>
              <GalleryStack.Screen name="CameraScreen" component={CameraScreen} options={{title: 'Camera'}} />
            </GalleryStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} options={{icon:'gear'}} />
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
