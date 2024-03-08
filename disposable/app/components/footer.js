import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

function Footer() {
    return (
        <View style={styles.footer}>
            <Link replace href="./home" asChild>
                <Pressable>
                    <Text>Footer</Text>   
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        backgroundColor: 'blue',
        height: 100,
        left: 0,
        right: 0,
        // bottom: 0,
        justifyContent: 'center',
        top: 0, // Add this line to fix the footer to the top
        
    },
});

export default Footer;