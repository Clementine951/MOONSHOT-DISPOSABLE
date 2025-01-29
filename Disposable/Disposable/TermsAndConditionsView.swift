//
//  TermsConds.swift
//  Disposable
//
//  Created by Clementine CUREL on 19/01/2025.
//

import SwiftUI

struct TermsAndConditionsView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                
                SectionHeader(title: "Introduction")
                Paragraph(text: """
                Welcome to the Disposable app, owned and operated by Clémentine Curel ("we", "us", or "our"). By accessing or using our app, you agree to be bound by these terms and conditions ("Terms"). If you do not agree with these Terms, please do not use our app.
                """)

                SectionHeader(title: "1. Use of the App")
                Paragraph(text: """
                1.1 Eligibility: You must be at least 13 years old to use our app. By using the app, you represent and warrant that you meet this age requirement.
                1.2 License: We grant you a non-exclusive, non-transferable, revocable license to access and use our app in accordance with these Terms.
                1.3 User Responsibilities: You agree to use the app for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the app.
                """)

                SectionHeader(title: "2. Data Collection and Privacy")
                Paragraph(text: """
                2.1 Data Collection: We do not collect any personal information except for the data provided through the contact form (name and email) and the photos saved within our app.
                2.2 Privacy Policy: Your use of the app is also governed by our Privacy Policy, which can be found in the app's settings or on our website at:
                """)
                Link("Disposable App Website", destination: URL(string: "https://sites.google.com/view/disposable-app/accueil")!)
                    .foregroundColor(.blue)

                SectionHeader(title: "3. Photos and Content")
                Paragraph(text: """
                3.1 Photo Storage: Photos taken and saved within our app are stored temporarily and will be deleted 1 hour after the end of the event.
                3.2 User Content: By uploading photos or content to our app, you grant us a temporary license to store and display that content for the duration specified.
                """)

                SectionHeader(title: "4. Third-Party Services")
                Paragraph(text: """
                4.1 Firebase: Our app uses Firebase, a secure database service. By using our app, you agree to Firebase's terms and conditions and privacy policy.
                """)

                SectionHeader(title: "5. Security")
                Paragraph(text: """
                5.1 Data Security: We use Firebase and follow best practices in app development to ensure your data is stored securely.
                5.2 Data Breach: In the event of a data breach, we will take appropriate actions to mitigate the breach and notify affected users as required by law.
                """)

                SectionHeader(title: "6. User Consent")
                Paragraph(text: """
                6.1 Event Creation: At the creation of an event, users must check a box to confirm they are aware that photos will be saved for a limited period.
                """)

                SectionHeader(title: "7. User Rights")
                Paragraph(text: """
                7.1 Data Access and Deletion: Users can request access to, correction of, or deletion of their data by contacting us via email or the contact form in the app.
                """)

                SectionHeader(title: "8. Changes to Terms")
                Paragraph(text: """
                8.1 Modifications: We may update these Terms from time to time. Any changes will be posted in the app's settings, under privacy updates, or on our website.
                """)

                SectionHeader(title: "9. Contact Information")
                Paragraph(text: """
                9.1 Support: If you have any questions or concerns about these Terms, please contact us via email at clem951@hotmail.fr or through the contact form in the app or on our website.
                """)

                SectionHeader(title: "10. Governing Law")
                Paragraph(text: """
                10.1 Jurisdiction: These Terms are governed by the laws of France. Any disputes arising out of or in connection with these Terms shall be resolved by the courts of France.
                """)

                SectionHeader(title: "11. Acceptance of Terms")
                Paragraph(text: """
                11.1 Agreement: By using our app, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use our app.
                """)

                SectionHeader(title: "12. Disclaimer")
                Paragraph(text: """
                12.1 Accuracy and Reliability: The app is developed for personal purposes by a student in computer science. While we strive to ensure the app is functional and reliable, issues may occur. You are welcome and encouraged to report any problems via our contact form in the app.
                """)
            }
            .padding()
        }
        .navigationTitle("Terms and Conditions")
    }
}

struct SectionHeader: View {
    let title: String
    
    var body: some View {
        Text(title)
            .font(.title2)
            .fontWeight(.bold)
            .padding(.top, 20)
    }
}

struct Paragraph: View {
    let text: String
    
    var body: some View {
        Text(text)
            .font(.body)
            .lineSpacing(5)
    }
}

struct TermsAndConditionsView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            TermsAndConditionsView()
        }
    }
}
