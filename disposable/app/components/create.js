import React from 'react';
import { Text, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Link } from 'expo-router';
import Footer from './footer';



function Create() {
    return (
        <View>
            <View style={styles.back}>
            <Text>Create an event</Text>
            <TextInput placeholder="Event's name" />
            <TextInput placeholder="Number of photos" />
            <TextInput placeholder="Duration of the event" />
            <TextInput placeholder="Release of the general gallery" />
            <Text>Event's name</Text>
            <Text>Number of photos</Text>
            <Text>Duration of the event</Text>
            <Text>Release of the general gallery</Text>

            <Link replace href="./qr" asChild>
                <Pressable>
                    <Text>Validate</Text>   
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

export default Create;