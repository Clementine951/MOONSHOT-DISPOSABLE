import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Footer from './footer';

function Join() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Join an event </Text>
            <Text> Camera to scan </Text>

            <Link replace href="./camera" asChild>
                <Pressable>
                    <Text>Enter the even camera</Text>   
                </Pressable>
            </Link>
            <Link replace href="./home" asChild>
                <Pressable>
                    <Text>Go back</Text>   
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

export default Join;