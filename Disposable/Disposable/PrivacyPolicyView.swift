//
//  PrivacyPolicy.swift
//  Disposable
//
//  Created by Clementine CUREL on 19/01/2025.
//

import SwiftUI

struct PrivacyPolicyView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {

                SectionHeader(title: "Owner and Data Controller")
                Paragraph(text: """
                Clémentine Curel
                Contact email: clem951@hotmail.fr
                """)
                
                SectionHeader(title: "Types of Data Collected")
                Paragraph(text: """
                1. Personal Data: When you use the contact form, we collect your name and email address. This data is saved to our database for the purpose of responding to your inquiries.
                2. Usage Data: We do not collect or save any usage data.
                3. Device Data: No device data is collected.
                4. Location Data: We do not collect location data.
                5. Photos: Photos taken and saved within our app are stored temporarily and are deleted 1 hour after the end of the event.
                """)
                
                SectionHeader(title: "Data Collection Details")
                Paragraph(text: """
                - We do not collect any other types of data.
                - No data is shared with third parties.
                """)
                
                SectionHeader(title: "Retention Time")
                Paragraph(text: """
                - Data related to events (including photos) is stored for the duration of the event, which can be up to a maximum of 25 hours, depending on the event settings.
                """)
                
                SectionHeader(title: "Users' Rights")
                Paragraph(text: """
                - You can request access, correction, or deletion of your data by contacting us via the contact form in the app's settings or via our website.
                """)
                Link("Disposable App Website", destination: URL(string: "https://sites.google.com/view/disposable-app/accueil")!)
                    .foregroundColor(.blue)
                    .padding(.bottom, 10)
                
                SectionHeader(title: "Data Security")
                Paragraph(text: """
                - We are committed to protecting your data and ensuring its security.
                """)
                
                SectionHeader(title: "Compliance")
                Paragraph(text: """
                - We comply with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
                - To comply with GDPR and CCPA, we:
                  - Obtain explicit consent from users before collecting any personal data.
                  - Provide clear information on data collection and processing.
                  - Offer users the ability to access, correct, or delete their data.
                  - Implement data protection measures to secure user data.
                """)
                
                SectionHeader(title: "Contact Information")
                Paragraph(text: """
                - If you have any questions or concerns about our privacy practices, please contact us via email at clem951@hotmail.fr, through the contact form in the app, or on our website.
                """)
                
                SectionHeader(title: "Policy Updates")
                Paragraph(text: """
                - We may update this privacy policy from time to time. Any changes will be posted on this page.
                """)
            }
            .padding()
        }
        .navigationTitle("Privacy Policy")
    }
}
