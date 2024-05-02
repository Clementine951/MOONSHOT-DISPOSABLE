import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
        <View style={styles.optionsContainer}>
          <Button
            title="Create an event"
            buttonStyle={styles.optionButton}
            containerStyle={styles.optionContainer}
            onPress={() => console.log('Create an event pressed')}
          />
          <Button
            title="Join an event"
            buttonStyle={styles.optionButton}
            containerStyle={styles.optionContainer}
            onPress={() => console.log('Join an event pressed')}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#FAD5BA',
  },
  disposableCameraContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  disposableCameraText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#E85D30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,

  },
  optionContainer: {
    marginHorizontal: 10,
  },
});