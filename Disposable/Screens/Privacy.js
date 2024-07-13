import React from 'react';
import { Text, View, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';

function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>

      <Text style={styles.sectionHeader}>Owner and Data Controller</Text>
      <Text style={styles.paragraph}>
        Clémentine Curel {"\n"}
        Contact email: clem951@hotmail.fr
      </Text>

      <Text style={styles.sectionHeader}>Types of Data Collected</Text>
      <Text style={styles.paragraph}>
        1. <Text style={styles.bold}>Personal Data</Text>: When you use the contact form, we collect your name and email address. This data is saved to our database for the purpose of responding to your inquiries.
      </Text>
      <Text style={styles.paragraph}>
        2. <Text style={styles.bold}>Usage Data</Text>: We do not collect or save any usage data.
      </Text>
      <Text style={styles.paragraph}>
        3. <Text style={styles.bold}>Device Data</Text>: No device data is collected.
      </Text>
      <Text style={styles.paragraph}>
        4. <Text style={styles.bold}>Location Data</Text>: We do not collect location data.
      </Text>
      <Text style={styles.paragraph}>
        5. <Text style={styles.bold}>Photos</Text>: Photos taken and saved within our app are stored temporarily and are deleted 1 hour after the end of the event.
      </Text>

      <Text style={styles.sectionHeader}>Data Collection Details</Text>
      <Text style={styles.paragraph}>
        - We do not collect any other types of data. {"\n"}
        - No data is shared with third parties.
      </Text>

      <Text style={styles.sectionHeader}>Retention Time</Text>
      <Text style={styles.paragraph}>
        - Data related to events (including photos) is stored for the duration of the event, which can be up to a maximum of 25 hours, depending on the event settings.
      </Text>

      <Text style={styles.sectionHeader}>Users' Rights</Text>
      <Text style={styles.paragraph}>
        - You can request access, correction, or deletion of your data by contacting us via the contact form in the app's settings or via our website at 
        <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/disposable-app/accueil')}>
          <Text style={styles.link}> Disposable App Website</Text>
        </TouchableOpacity>.
      </Text>

      <Text style={styles.sectionHeader}>Data Security</Text>
      <Text style={styles.paragraph}>
        - We are committed to protecting your data and ensuring its security.
      </Text>

      <Text style={styles.sectionHeader}>Compliance</Text>
      <Text style={styles.paragraph}>
        - We comply with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). {"\n"}
        - To comply with GDPR and CCPA, we: {"\n"}
          - Obtain explicit consent from users before collecting any personal data. {"\n"}
          - Provide clear information on data collection and processing. {"\n"}
          - Offer users the ability to access, correct, or delete their data. {"\n"}
          - Implement data protection measures to secure user data.
      </Text>

      <Text style={styles.sectionHeader}>Contact Information</Text>
      <Text style={styles.paragraph}>
        - If you have any questions or concerns about our privacy practices, please contact us via email at clem951@hotmail.fr, through the contact form in the app, or on our website.
      </Text>

      <Text style={styles.sectionHeader}>Policy Updates</Text>
      <Text style={styles.paragraph}>
        - We may update this privacy policy from time to time. Any changes will be posted on this page.
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
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 60, 
  },
});

export default PrivacyPolicy;
