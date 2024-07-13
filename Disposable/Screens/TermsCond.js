import React from 'react';
import { Text, View, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';

function TermsCond() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>

      <Text style={styles.sectionHeader}>Introduction</Text>
      <Text style={styles.paragraph}>
        Welcome to the Disposable app, owned and operated by Clémentine Curel ("we", "us", or "our"). By accessing or using our app, you agree to be bound by these terms and conditions ("Terms"). If you do not agree with these Terms, please do not use our app.
      </Text>

      <Text style={styles.sectionHeader}>1. Use of the App</Text>
      <Text style={styles.paragraph}>
        1.1 <Text style={styles.bold}>Eligibility</Text>: You must be at least 13 years old to use our app. By using the app, you represent and warrant that you meet this age requirement.
      </Text>
      <Text style={styles.paragraph}>
        1.2 <Text style={styles.bold}>License</Text>: We grant you a non-exclusive, non-transferable, revocable license to access and use our app in accordance with these Terms.
      </Text>
      <Text style={styles.paragraph}>
        1.3 <Text style={styles.bold}>User Responsibilities</Text>: You agree to use the app for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the app.
      </Text>

      <Text style={styles.sectionHeader}>2. Data Collection and Privacy</Text>
      <Text style={styles.paragraph}>
        2.1 <Text style={styles.bold}>Data Collection</Text>: We do not collect any personal information except for the data provided through the contact form (name and email) and the photos saved within our app.
      </Text>
      <Text style={styles.paragraph}>
        2.2 <Text style={styles.bold}>Privacy Policy</Text>: Your use of the app is also governed by our Privacy Policy, which can be found in the app's settings or on our website at 
        <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/disposable-app/accueil')}>
          <Text style={styles.link}> Disposable App Website</Text>
        </TouchableOpacity>.
      </Text>

      <Text style={styles.sectionHeader}>3. Photos and Content</Text>
      <Text style={styles.paragraph}>
        3.1 <Text style={styles.bold}>Photo Storage</Text>: Photos taken and saved within our app are stored temporarily and will be deleted 1 hour after the end of the event.
      </Text>
      <Text style={styles.paragraph}>
        3.2 <Text style={styles.bold}>User Content</Text>: By uploading photos or content to our app, you grant us a temporary license to store and display that content for the duration specified.
      </Text>

      <Text style={styles.sectionHeader}>4. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        4.1 <Text style={styles.bold}>Firebase</Text>: Our app uses Firebase, a secure database service. By using our app, you agree to Firebase's terms and conditions and privacy policy.
      </Text>

      <Text style={styles.sectionHeader}>5. Security</Text>
      <Text style={styles.paragraph}>
        5.1 <Text style={styles.bold}>Data Security</Text>: We use Firebase and follow best practices in app development to ensure your data is stored securely.
      </Text>
      <Text style={styles.paragraph}>
        5.2 <Text style={styles.bold}>Data Breach</Text>: In the event of a data breach, we will take appropriate actions to mitigate the breach and notify affected users as required by law.
      </Text>

      <Text style={styles.sectionHeader}>6. User Consent</Text>
      <Text style={styles.paragraph}>
        6.1 <Text style={styles.bold}>Event Creation</Text>: At the creation of an event, users must check a box to confirm they are aware that photos will be saved for a limited period.
      </Text>

      <Text style={styles.sectionHeader}>7. User Rights</Text>
      <Text style={styles.paragraph}>
        7.1 <Text style={styles.bold}>Data Access and Deletion</Text>: Users can request access to, correction of, or deletion of their data by contacting us via email or the contact form in the app.
      </Text>

      <Text style={styles.sectionHeader}>8. Changes to Terms</Text>
      <Text style={styles.paragraph}>
        8.1 <Text style={styles.bold}>Modifications</Text>: We may update these Terms from time to time. Any changes will be posted in the app's settings, under privacy updates, or on our website.
      </Text>

      <Text style={styles.sectionHeader}>9. Contact Information</Text>
      <Text style={styles.paragraph}>
        9.1 <Text style={styles.bold}>Support</Text>: If you have any questions or concerns about these Terms, please contact us via email at clem951@hotmail.fr or through the contact form in the app or on our website.
      </Text>

      <Text style={styles.sectionHeader}>10. Governing Law</Text>
      <Text style={styles.paragraph}>
        10.1 <Text style={styles.bold}>Jurisdiction</Text>: These Terms are governed by the laws of France. Any disputes arising out of or in connection with these Terms shall be resolved by the courts of France.
      </Text>

      <Text style={styles.sectionHeader}>11. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        11.1 <Text style={styles.bold}>Agreement</Text>: By using our app, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use our app.
      </Text>

      <Text style={styles.sectionHeader}>12. Disclaimer</Text>
      <Text style={styles.paragraph}>
        12.1 <Text style={styles.bold}>Accuracy and Reliability</Text>: The app is developed for personal purposes by a student in computer science. While we strive to ensure the app is functional and reliable, issues may occur. You are welcome and encouraged to report any problems via our contact form in the app.
      </Text>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#09745F',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 60, 
  },
});

export default TermsCond;
