import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Footer from './footer';

function QRCode() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Welcome to Generate a QR code</Text>
            <Link replace href="./camera" asChild>
                <Pressable>
                    <Text>Go to the event </Text>   
                </Pressable>
            </Link>
            <Text>Share</Text>
            <Text>Save</Text>
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

export default QRCode;