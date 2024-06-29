import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import { SceneMap } from 'react-native-tab-view';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { EventContext } from './EventContext';

const initialLayout = { width: Dimensions.get('window').width };

// GalleryScreen component handles displaying images in tabs
const GalleryScreen = () => {
  const { eventDetails } = useContext(EventContext);  // Get event details from context
  const [index, setIndex] = useState(0);  // State for tab index
  const [routes] = useState([
    { key: 'personal', title: 'Personal' },
    { key: 'general', title: 'General' }
  ]);  // Routes for tabs
  const [generalImages, setGeneralImages] = useState([]);  // State for general images

  // Effect to fetch images from Firestore
  useEffect(() => {
    if (!eventDetails.event) return;

    // Query Firestore to get images ordered by timestamp
    const q = query(collection(db, 'events', eventDetails.event, 'images'), orderBy('timestamp'));

    // Real-time listener for Firestore updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const urls = snapshot.docs.map(doc => doc.data().url);
        console.log('Fetched URLs:', urls); // Log the URLs
        setGeneralImages(urls);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [eventDetails.event]);

  // Function to render each image
  const renderImage = ({ item }) => {
    console.log('Rendering image with URL:', item); // Log the URL being rendered
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item }}
          style={styles.image}
          onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
          resizeMode="cover"
        />
      </View>
    );
  };

  // Component for Personal tab (currently showing "No photos")
  const PersonalRoute = () => (
    <View style={styles.noPhotosContainer}>
      <Text style={styles.noPhotosText}>No photos</Text>
    </View>
  );

  // Component for General tab displaying images
  const GeneralRoute = () => (
    generalImages.length > 0 ? (
      <FlatList
        data={generalImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImage}
        numColumns={3}
      />
    ) : (
      <View style={styles.noPhotosContainer}>
        <Text style={styles.noPhotosText}>No photos</Text>
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{generalImages.length} Photos</Text>
        <TouchableOpacity>
          <MaterialIcons name="file-download" size={30} color="#09745F" />
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          personal: PersonalRoute,
          general: GeneralRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
    </View>
  );
};

// Styles for the GalleryScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
  },
  topBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#09745F',
  },
  indicator: {
    backgroundColor: '#09745F',
  },
  tabBar: {
    backgroundColor: '#FFF',
  },
  tabLabel: {
    color: '#09745F',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    margin: 1,
  },
  image: {
    width: '100%',
    height: 100,
  },
  noPhotosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotosText: {
    fontSize: 18,
    color: '#09745F',
  },
});

export default GalleryScreen;
