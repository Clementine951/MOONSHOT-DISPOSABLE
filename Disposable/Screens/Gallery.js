import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import { SceneMap } from 'react-native-tab-view';
import { storage } from '../firebaseConfig';
import { listAll, getDownloadURL, ref } from 'firebase/storage';
import { EventContext } from './EventContext';

const initialLayout = { width: Dimensions.get('window').width };

const GalleryScreen = () => {
  const { eventDetails } = useContext(EventContext);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personal', title: 'Personal' },
    { key: 'general', title: 'General' }
  ]);
  const [images, setImages] = useState([]);
  const [personalImages, setPersonalImages] = useState([]);
  const [generalImages, setGeneralImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!eventDetails.eventId) return;
      try {
        const listRef = ref(storage, `${eventDetails.eventId}/${imageName}`);
        const res = await listAll(listRef);
        const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
        setImages(urls);
        setPersonalImages(urls.filter(url => url.includes('personal')));
        setGeneralImages(urls.filter(url => url.includes('general')));
      } catch (error) {
        console.error('Error fetching images: ', error);
      }
    };

    fetchImages();
  }, [eventDetails.eventId]);

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  const PersonalRoute = () => (
    personalImages.length > 0 ? (
      <FlatList
        data={personalImages}
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
        <Text style={styles.topBarText}>{images.length} Photos</Text>
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