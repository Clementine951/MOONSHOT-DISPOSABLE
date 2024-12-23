import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { fetchFirestoreData } from '../firebaseApi';
import { EventContext } from './EventContext';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Define initial layout for tab view
const initialLayout = { width: Dimensions.get('window').width };

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const GalleryScreen = () => {
  const { eventDetails, userName } = useContext(EventContext);
  const [index, setIndex] = useState(0); // State for the currently selected tab index

  const [routes] = useState([
    { key: 'personal', title: 'Personal' },
    { key: 'general', title: 'General' }
  ]);

  const [generalImages, setGeneralImages] = useState([]);
  const [personalImages, setPersonalImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!eventDetails?.eventId) return;

      console.log('Fetching images for event:', eventDetails.eventId);

      try {
        const response = await fetchFirestoreData(`events/${eventDetails.eventId}/images`);
        const imageDocs = response.documents || [];

        const allImages = imageDocs.map((doc) => ({
          url: doc.fields?.url?.stringValue || '',
          owner: doc.fields?.owner?.stringValue || 'Unknown',
          timestamp: doc.fields?.timestamp?.integerValue || 0,
        }));

        setGeneralImages(allImages);
        setPersonalImages(allImages.filter((img) => img.owner === userName));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [eventDetails?.eventId, userName]);

  const openModal = (index, images) => {
    setCurrentImageIndex(index);
    setModalImages(images);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderImage = ({ item, index, images }) => (
    <TouchableOpacity onPress={() => openModal(index, images)} style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <Modal visible={isModalVisible} transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <MaterialIcons name="close" size={width > 768 ? 60 : 30} color="#FFF" />
        </TouchableOpacity>
        <FlatList
          data={modalImages}
          horizontal
          pagingEnabled
          initialScrollIndex={currentImageIndex}
          getItemLayout={(data, index) => (
            { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
          )}
          renderItem={({ item }) => (
            <View style={styles.fullImageContainer}>
              <Image source={{ uri: item.url }} style={styles.fullImage} />
              <Text style={styles.imageOwner}>Taken by: {item.owner}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Modal>
  );

  const downloadImages = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the gallery is required.');
      return;
    }

    try {
      for (const image of generalImages) {
        const url = image.url;
        const filename = url.split('/').pop();
        const fileUri = FileSystem.documentDirectory + filename;

        await FileSystem.downloadAsync(url, fileUri);
        await MediaLibrary.createAssetAsync(fileUri);
      }
      Alert.alert('Saved', 'All photos have been saved to your gallery.');
    } catch (error) {
      console.error('Error downloading images:', error);
      Alert.alert('Error', 'Failed to download images. Please try again.');
    }
  };

  const PersonalRoute = () => (
    personalImages.length > 0 ? (
      <FlatList
        data={personalImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderImage({ item, index, images: personalImages })}
        numColumns={4}
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
        renderItem={({ item, index }) => renderImage({ item, index, images: generalImages })}
        numColumns={4}
      />
    ) : (
      <View style={styles.noPhotosContainer}>
        <Text style={styles.noPhotosText}>No photos have been taken for the moment</Text>
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{generalImages.length} Photos</Text>
        <TouchableOpacity onPress={downloadImages}>
          <MaterialIcons name="file-download" size={width > 768 ? 60 : 30} color="#09745F" />
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
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
      {renderModalContent()}
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
    padding: width > 768 ? 30 : 20,
    paddingLeft: width > 768 ? 60 : 25,
    backgroundColor: '#FFF',
  },
  topBarText: {
    fontSize: width > 768 ? 40 : 18,
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
    fontSize: width > 768 ? 30 : 18,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullImageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  imageOwner: {
    color: '#FFF',
    fontSize: width > 768 ? 30 : 18,
    marginTop: 10,
  },
});

export default GalleryScreen;