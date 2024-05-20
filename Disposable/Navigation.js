import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure you have this package if you're using icons

// Lazy load the screen components
// const HomeScreen = React.lazy(() => import('./Screens/Home'));
// const CameraScreen = React.lazy(() => import('./Screens/Camera'));
// const GalleryScreen = React.lazy(() => import('./Screens/Gallery'));
// const SettingsScreen = React.lazy(() => import('./Screens/Settings'));
// const CreatePage = React.lazy(() => import('./Screens/Create'));
// const JoinPage = React.lazy(() => import('./Screens/Join'));
// const HallPage = React.lazy(() => import('./Screens/Hall'));

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
        <Tab.Screen 
          name="Home" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        >
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }}/>
              <HomeStack.Screen name="CreatePage" component={CreatePage} options={{ title: 'Create Event' }}/>
              <HomeStack.Screen name="JoinPage" component={JoinPage} options={{ title: 'Join Event' }}/>
              <HomeStack.Screen name="HallPage" component={HallPage} options={{ title: 'Event Hall' }}/>
            </HomeStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="Camera" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="camera" color={color} size={size} />
            ),
          }}
        >
          {() => (
            <CameraStack.Navigator>
              <CameraStack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Camera' }}/>
            </CameraStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="Gallery" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="image" color={color} size={size} />
            ),
          }}
        >
          {() => (
            <GalleryStack.Navigator>
              <GalleryStack.Screen name="GalleryScreen" component={GalleryScreen} options={{ title: 'Gallery' }}/>
              <GalleryStack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Camera' }}/>
            </GalleryStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="Settings" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        >
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }}/>
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
