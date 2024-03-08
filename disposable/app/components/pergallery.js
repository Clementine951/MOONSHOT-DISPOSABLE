import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Footer from './footer';

function PersonalGallery() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Welcome to the personal gallery</Text>
            <Link replace href="./camera" asChild>
                <Pressable>
                    <Text>Camera</Text>   
                </Pressable>
            </Link>
            <Text>Save all photos</Text>
            <Link replace href="./gengallery" asChild>
                <Pressable>
                    <Text>General gallery</Text>   
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

export default PersonalGallery;