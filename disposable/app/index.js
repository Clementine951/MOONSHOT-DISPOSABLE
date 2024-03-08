import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import Footer from './components/footer';
import Home from './components/home';

export default function Page() {
  return (
    <View>
    <View style={styles.back}>
    <Text>Welcome to home dispo</Text>
    <Link replace href="./components/create" asChild>
        <Pressable>
            <Text>Create an event</Text>   
        </Pressable>
    </Link>
    <Link replace href="./components/join" asChild>
        <Pressable>
            <Text>Join an event</Text>   
        </Pressable>
    </Link>
    </View>
    <View>
        <Footer></Footer>
    </View>
</View>
  );
}

const styles = StyleSheet.create({
  back: {
    height: '96%',
    backgroundColor: '#fff1f7',
},
});