import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventContext } from './Screens/EventContext';

import HomeScreen from './Screens/Home';
import CameraScreen from './Screens/Camera';
import GalleryScreen from './Screens/Gallery';
import SettingsScreen from './Screens/Settings';
import EventSettingsScreen from './Screens/EventSettings';
import DataSettingsScreen from './Screens/DataSettings';
import AppSettingsScreen from './Screens/AppSettings';
import ContactFormScreen from './Screens/ContactForm';
import PrivacyScreen from './Screens/Privacy';
import TermsCondScreen from './Screens/TermsCond';
import CreatePage from './Screens/Create';
import JoinPage from './Screens/Join';
import HallPage from './Screens/Hall';
import PrivacyPolicy from './Screens/Privacy';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();
const GalleryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const Green = "#09745F";

export default function AppNavigation() {
  const { eventDetails } = useContext(EventContext);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Home"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons name="home" color={focused ? Green : 'gray'} size={size} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? Green : 'gray' }}>Home</Text>
            ),
          }}
        >
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Disposable' }}/>
              <HomeStack.Screen name="CreatePage" component={CreatePage} options={{ title: 'Creation' }}/>
              <HomeStack.Screen name="JoinPage" component={JoinPage} options={{ title: 'Join Event' }}/>
              <HomeStack.Screen name="HallPage" component={HallPage} options={{ title: 'Event Hall' }}/>
            </HomeStack.Navigator>
          )}
        </Tab.Screen>
        {eventDetails && (
          <>
            <Tab.Screen 
              name="Camera"
              options={{
                tabBarIcon: ({ focused, size }) => (
                  <MaterialCommunityIcons name="camera" color={focused ? Green : 'gray'} size={size} />
                ),
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? Green : 'gray' }}>Camera</Text>
                ),
              }}
            >
              {() => (
                <CameraStack.Navigator>
                  <CameraStack.Screen 
                    name="CameraScreen" 
                    component={CameraScreen} 
                    options={{ title: 'Camera' }}
                    initialParams={{ eventId: eventDetails.eventId, eventName: eventDetails.eventName, numberOfPhotos: eventDetails.numberOfPhotos }}
                  />
                </CameraStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen 
              name="Gallery"
              options={{
                tabBarIcon: ({ focused, size }) => (
                  <MaterialCommunityIcons name="image" color={focused ? Green : 'gray'} size={size} />
                ),
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? Green : 'gray' }}>Gallery</Text>
                ),
              }}
            >
              {() => (
                <GalleryStack.Navigator>
                  <GalleryStack.Screen 
                    name="GalleryScreen" 
                    component={GalleryScreen} 
                    options={{ title: 'Gallery' }}
                  />
                </GalleryStack.Navigator>
              )}
            </Tab.Screen>
          </>
        )}
        <Tab.Screen 
          name="Settings"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons name="cog" color={focused ? Green : 'gray'} size={size} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? Green : 'gray' }}>Settings</Text>
            ),
          }}
        >
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen 
                name="SettingsScreen" 
                component={SettingsScreen} 
                options={{ title: 'Settings' }}
              />
              <SettingsStack.Screen 
                name="EventSettings" 
                component={EventSettingsScreen} 
                options={{ title: 'Event Settings' }}
              />
              <SettingsStack.Screen 
                name="DataSettings" 
                component={DataSettingsScreen} 
                options={{ title: 'Privacy' }}
              />
              <SettingsStack.Screen 
                name="AppSettings" 
                component={AppSettingsScreen} 
                options={{ title: 'App Settings' }}
              />
              <SettingsStack.Screen 
                name="ContactForm" 
                component={ContactFormScreen} 
                options={{ title: 'Contact Form' }}
              />
              <SettingsStack.Screen 
                name="Privacy" 
                component={PrivacyPolicy} 
                options={{ title: 'Privacy Policy' }}
              />
              <SettingsStack.Screen 
                name="TermsCond" 
                component={TermsCondScreen} 
                options={{ title: 'Terms and Conditions' }}
              />
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
