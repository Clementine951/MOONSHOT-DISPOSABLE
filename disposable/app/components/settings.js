import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import Footer from './footer';


function Settings() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Welcome to settings</Text>
            <Link replace href="./camera" asChild>
                <Pressable>
                    <Text>go to camera</Text>   
                </Pressable>
            </Link>
            <Link replace href="./pergallery" asChild>
                <Pressable>
                    <Text>Go tho the galleries</Text>   
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

export default Settings;