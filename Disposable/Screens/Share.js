import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

function ShareScreen() {
    const route = useRoute();
    const { eventName } = route.params;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Event Name: {eventName}</Text>
            <Text>Share your code</Text>
            <Text>Image of the QR code</Text>
        </View>
    );
}

export default ShareScreen;
