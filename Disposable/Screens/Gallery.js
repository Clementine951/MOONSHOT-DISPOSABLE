import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
// import firebaseConfig from './../firebaseConfig';
// import { initializeApp } from 'firebase/app'; //validate yourself
// import { getStorage, ref, getDownloadURL } from 'firebase/storage'; //access the storage database

// initializeApp(firebaseConfig);

function GalleryScreen() {
  // const [url, setUrl] = useState();

  // useEffect(() => {
  //   const func = async () => {
  //     const storage = getStorage();
  //     const reference = ref(storage, '/images/1714919803758.jpg');
  //     await getDownloadURL(reference).then((x) => {
  //       setUrl(x);
  //     })
  //   }

  //   if (url == undefined) {func()};
  // }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#123456', alignItems: 'center', justifyContent: 'center'}}>
      {/* <Image
        style={{width: '70%', height: '70%'}}
        source={{ uri: url }}
      /> */}
      <Text style={{color: 'white', fontSize: 20}}>Gallery Screen</Text>
    </View>
  );
}
export default GalleryScreen;