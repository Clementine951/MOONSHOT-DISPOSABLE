import React from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

function CreatePage() {
  const [text, setText] = React.useState('');

  return (
    <View >
      <Text>Creation</Text>
      <TextInput
      label="Email"
      value={text}
      onChangeText={text => setText(text)}
    />
    </View>
  );
}

export default CreatePage;
