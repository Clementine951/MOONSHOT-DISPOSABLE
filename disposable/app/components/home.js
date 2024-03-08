import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Footer from './footer';


function Home() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Welcome to home</Text>
            <Link replace href="./create" asChild>
                <Pressable>
                    <Text>Create an event</Text>   
                </Pressable>
            </Link>
            <Link replace href="./join" asChild>
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

export default Home;