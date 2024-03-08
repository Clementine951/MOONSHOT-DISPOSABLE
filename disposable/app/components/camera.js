import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import Footer from './footer';


function Camera() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Welcome to Camera</Text>
            <Link replace href="./settings" asChild>
                <Pressable>
                    <Text>go to settings</Text>   
                </Pressable>
            </Link>
            <Link replace href="./pergallery" asChild>
                <Pressable>
                    <Text>Go the the galleries</Text>   
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

export default Camera;