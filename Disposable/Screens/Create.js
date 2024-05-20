import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, List, Button, SegmentedButtons } from 'react-native-paper';

function CreatePage({ navigation }) {
  const [event, setEventName] = useState('');
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState('');
  const [reveal, setReveal] = useState('');
  const [number, setNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (event && start && duration && reveal && number) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [event, start, duration, reveal, number]);

  const color = '#E6672B';

  return (
    <View>
      <TextInput
        label="The event's name"
        left={<TextInput.Icon name="event" />}
        value={event}
        onChangeText={(text) => setEventName(text)}
      />

      <List.Section title={`Start of the event`}>
        <SegmentedButtons
          onValueChange={(value) => setStart(value)}
          value={start}
          density="medium"
          buttons={[
            {
              style: { flex: 1 },
              value: 'startNow',
              label: 'Now',
            },
            {
              style: { flex: 1 },
              disabled: true,
              value: 'startLater',
              label: 'Start Later',
            },
          ]}
        />
      </List.Section>

      <List.Section title={`Duration of the event`}>
        <SegmentedButtons
          onValueChange={(value) => setDuration(value)}
          value={duration}
          density="medium"
          buttons={[
            {
              style: { flex: 1 },
              value: '8h',
              label: '8h',
            },
            {
              style: { flex: 1 },
              value: '12h',
              label: '12h',
            },
            {
              style: { flex: 1 },
              value: '24h',
              label: '24h',
            },
            {
              style: { flex: 1 },
              value: '48h',
              label: '48h',
            },
          ]}
        />
      </List.Section>

      <List.Section title={`Photos reveal`}>
        <SegmentedButtons
          onValueChange={(value) => setReveal(value)}
          value={reveal}
          density="medium"
          buttons={[
            {
              style: { flex: 1 },
              value: 'revealNow',
              label: 'Immediately',
            },
            {
              style: { flex: 1 },
              value: 'revealEnd',
              label: 'At the end',
            },
            {
              style: { flex: 1 },
              value: 'revealNext',
              label: '24h later',
            },
          ]}
        />
      </List.Section>

      <List.Section title={`Photos per person`}>
        <SegmentedButtons
          onValueChange={(value) => setNumber(value)}
          value={number}
          density="medium"
          buttons={[
            {
              style: { flex: 1 },
              value: 'five',
              label: '5',
            },
            {
              style: { flex: 1 },
              value: 'ten',
              label: '10',
            },
            {
              style: { flex: 1 },
              value: 'fifteen',
              label: '15',
            },
            {
              style: { flex: 1 },
              value: 'twenty',
              label: '20',
            },
          ]}
        />
      </List.Section>
      <List.Section>
      <Button
        mode="contained-tonal"
        buttonColor='#09745F'
        textColor='#FFF7F1'
        onPress={() => {
          navigation.replace('HallPage', { // Ensure this is the correct screen name
            // params: {
              event: event,
              start: start,
              duration: duration,
              reveal: reveal,
              number: number,
            // },
          });
        }}
        style={{ margin: 5 }}
        disabled={isButtonDisabled}
      >
        Validate
      </Button>


      </List.Section>
    </View>
  );
}

export default CreatePage;
