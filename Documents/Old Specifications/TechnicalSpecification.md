# Disposable Camera Application - Technical Specification

<details>
<summary>Table of Contents</summary>

- [Disposable Camera Application - Technical Specification](#disposable-camera-application---technical-specification)
  - [1. **Introduction**](#1-introduction)
  - [2. **Technologies Used**](#2-technologies-used)
    - [2.1 **Frontend**](#21-frontend)
    - [2.2 **Backend**](#22-backend)
    - [2.3 **iOS-Specific Technologies**](#23-ios-specific-technologies)
    - [2.4 **Database \& Storage Management**](#24-database--storage-management)
    - [2.5 **Web and Domain Management**](#25-web-and-domain-management)
    - [2.6 **Development Tools**](#26-development-tools)
    - [2.7 **Other Considerations**](#27-other-considerations)
  - [3. **Architecture Overview**](#3-architecture-overview)
    - [3.1 **System Architecture**](#31-system-architecture)
    - [3.2 **Component Diagram**](#32-component-diagram)
  - [4. **Data Flow**](#4-data-flow)
    - [4.1 **Event Creation**](#41-event-creation)
    - [4.2 **Image Handling**](#42-image-handling)
    - [4.3 **App Clip Interaction**](#43-app-clip-interaction)
  - [5. **Database Structure**](#5-database-structure)
    - [5.1 **Firestore Collections and Documents**](#51-firestore-collections-and-documents)
    - [5.2 **Firebase Storage Structure**](#52-firebase-storage-structure)
  - [6. **App Clips Setup**](#6-app-clips-setup)
    - [6.1 **Associated Domains**](#61-associated-domains)
    - [6.2 **AASA File Configuration**](#62-aasa-file-configuration)
  - [7. **Security Considerations**](#7-security-considerations)
  - [8. **Performance and Scalability**](#8-performance-and-scalability)
    - [8.1 **Performance**](#81-performance)
    - [8.2 **Scalability**](#82-scalability)
  - [9. **Deployment**](#9-deployment)
    - [9.1 **Deployment Process**](#91-deployment-process)
    - [9.2 **Continuous Integration/Continuous Deployment (CI/CD)**](#92-continuous-integrationcontinuous-deployment-cicd)
  - [10. **Testing and Quality Assurance**](#10-testing-and-quality-assurance)
    - [10.1 **Unit Testing**](#101-unit-testing)
    - [10.2 **Integration Testing**](#102-integration-testing)
    - [10.3 **User Acceptance Testing (UAT)**](#103-user-acceptance-testing-uat)
  - [11. **Documentation and Maintenance**](#11-documentation-and-maintenance)
    - [11.1 **Code Documentation**](#111-code-documentation)
    - [11.2 **User Documentation**](#112-user-documentation)
    - [11.3 **Maintenance**](#113-maintenance)
- [Glossary](#glossary)

</details>

## 1. **Introduction**

The Disposable Camera application is a mobile app designed to provide users with a nostalgic and communal experience of capturing and sharing moments at events. This technical specification document outlines the architecture, technologies, and processes used to develop and maintain the application. The app is initially targeted for iOS, with plans for cross-platform support in the future.

## 2. **Technologies Used**

### 2.1 **Frontend**

- **React Native (Expo)**
  - **Purpose**: To build the mobile application for both iOS and, in the future, Android platforms.
  - **Details**: 
    - **Expo**: A framework and platform for universal React applications that run on all devices. It simplifies development and deployment by providing tools and services tailored for React Native.
  - **Benefits**:
    - Streamlined development with rapid prototyping and easy testing on different platforms.
    - Access to native APIs (e.g., Camera, Location) through managed packages.

### 2.2 **Backend**

- **Firebase**
  - **Purpose**: Serves as the backend for the application, handling data storage, and media storage.
  - **Components**:
    - **Firestore**: A NoSQL document database used to store event data, including metadata about events, photos, and participants.
      - **Collections**: `events` (containing documents for each event).
      - **Sub-collections**: `images` and `participants` under each event.
    - **Firebase Storage**: Used for storing event-related media (e.g., photos).
      - **File Naming**: Photos are stored with a naming convention that includes the user’s name and a sequence number.
      - **Integration**: URLs for accessing stored images are saved in Firestore.

### 2.3 **iOS-Specific Technologies**

- **App Clips**
  - **Purpose**: Provides a lightweight version of the app that allows iOS users to interact with specific event-related features without downloading the full app.
  - **Technologies**:
    - **Swift & SwiftUI**: Used to develop the App Clip, offering a native iOS experience.
    - **Associated Domains & AASA File**: Required for enabling App Clips, ensuring the correct routing and access through QR codes.
    - **Hosting**: Managed by Cloudflare, with AASA file management to define the associated domains and capabilities.

- **Cloudflare**
  - **Purpose**: Manages DNS settings, SSL certificates, and serves the AASA file required for App Clips.
  - **Details**:
    - Provides infrastructure for secure and scalable access to the AASA file.
    - Supports routing and domain management for `disposableapp.xyz`.

### 2.4 **Database & Storage Management**

- **Firestore**
  - **Purpose**: Serves as the primary database for the application.
  - **Details**:
    - Handles real-time updates, ensuring that all participants in an event see the latest photos and information.
    - Provides scalability and security for managing multiple events and users.

- **Firebase Storage**
  - **Purpose**: Manages storage for all event-related media.
  - **Details**:
    - Stores images securely and provides URLs that can be embedded in the app for displaying photos.
    - Integrates seamlessly with Firestore to link media with corresponding metadata.

### 2.5 **Web and Domain Management**

- **GoDaddy**
  - **Purpose**: The domain registrar for `disposableapp.xyz`.
  - **Details**:
    - Manages domain settings, which are critical for ensuring that the app and its features (like App Clips) are accessible.

- **Cloudflare Workers**
  - **Purpose**: A serverless computing platform used to serve the AASA file and manage requests related to domain-specific operations.
  - **Details**:
    - Provides the correct content type and security headers required by iOS for App Clips.

### 2.6 **Development Tools**

- **GitHub**
  - **Purpose**: Version control and source code management.
  - **Details**:
    - Hosts the project repository, including all code, documentation, and issue tracking.
    - Provides CI/CD potential for automated testing and deployment in the future.

- **Xcode**
  - **Purpose**: IDE for developing and testing iOS-specific features, including the App Clip.
  - **Details**:
    - Used for building and deploying the App Clip, managing certificates, and configuring associated domains.

- **Visual Studio Code**
  - **Purpose**: Primary code editor for writing React Native code.
  - **Details**:
    - Supports a wide range of plugins for linting, debugging, and enhancing the development workflow.

### 2.7 **Other Considerations**

- **No Authentication**
  - **Purpose**: Simplifies the user experience by storing data locally and in Firebase without user accounts.
  - **Details**:
    - Currently, the app does not use Firebase Authentication or any other authentication method. All data interactions are managed directly on the device or within Firebase.

- **No Notifications**
  - **Purpose**: Notifications are not implemented, focusing the app’s scope on core functionality.
  - **Details**:
    - Consider integrating Firebase Cloud Messaging (FCM) in future updates if notifications become a required feature.

## 3. **Architecture Overview**

### 3.1 **System Architecture**

The system architecture is designed to support a scalable and reliable event-based photo-sharing platform. The architecture comprises the following components:

- **Frontend**: Built with React Native using Expo, targeting iOS devices initially. The frontend interacts with Firebase to fetch and store data.
- **Backend**: Firebase serves as the backend, handling data storage with Firestore and media storage with Firebase Storage.
- **App Clip**: A lightweight version of the app, developed using Swift and SwiftUI, which allows users to participate in events without downloading the full app.
- **Database**: Firestore is used for structured data storage, and Firebase Storage handles media files.
- **Domain and Routing**: Managed by Cloudflare, with Cloudflare Workers serving the AASA file for App Clips.

### 3.2 **Component Diagram**

The following diagram outlines the major components of the Disposable Camera application:

```
[Frontend (React Native - Expo)]
       |
       |---> [Firebase (Firestore, Storage)]
       |
[Backend]
       |
       |---> [iOS App Clip (Swift, SwiftUI)]
       |
[Cloudflare (AASA, Routing)]
       |
       |---> [GoDaddy (Domain Management)]
```

## 4. **Data Flow**

### 4.1 **Event Creation**

1. **Admin (Organizer) Action**:
   - The organizer creates an event in the app by providing details such as event name, duration, and maximum photo limit.
   - A unique event ID is generated and stored in Firestore.
   - A QR code linking to the App Clip is generated for participants.

2. **Data Storage**:
   - Event metadata (e.g., event name, duration, number of photos) is stored in Firestore under the `events` collection.
   - Each event’s photos are stored in Firebase Storage in a folder named after the event ID.

3. **User Interaction**:
   - Participants can join the event by scanning the QR code, which opens the App Clip.
   - Participants take photos, which are uploaded and stored under the corresponding event’s folder in Firebase Storage.

### 4.2 **Image Handling**

1. **Photo Capture**:
   - Participants capture photos using the app’s built-in camera interface.
   - The photo is stored locally on the device until it is uploaded to Firebase Storage.

2. **Photo Upload**:
   - Photos are uploaded to Firebase Storage with a naming convention that includes the participant’s name and a sequence number.
   - The URL of the uploaded photo is saved in Firestore under the event’s `images` sub-collection.

3. **Photo Access**:
   - Photos are accessible to all participants in the event through the general gallery.
   - Participants can download photos directly from the app.

### 4.3 **App Clip Interaction**

1. **Accessing the App Clip**:
   - Participants scan a QR code associated with an event.
   - The App Clip opens, prompting the participant to enter their name.

2. **App Clip Features**:
   - Participants can view the general gallery, upload photos, and download photos.
   - The App Clip does not provide access to personal settings or the full app’s functionality.

3. **Data Sync**:
   - All interactions within the App Clip are synced with Firebase, ensuring that the full app and the App Clip share the same data.

## 5. **Database Structure**

### 5.1 **Firestore Collections and Documents**

- **Collection: `events`**
  - **Document ID**: `eventId` (e.g., `Also_1725111327712`)
  - **Fields**:
    - `appClipURL`: (string) URL to the App Clip for this event.
    - `duration`: (number) Duration of the event in hours.
    - `eventId`: (string) Unique identifier for the event.
    - `eventName`: (string) Name of the event.
    - `numberOfPhotos`: (number) Maximum number of photos each participant can take.
    - `reveal`: (string) Determines when photos are revealed (e.g., `revealNow`).
    - `revealTime`: (string) Timestamp for when photos should be revealed.
    - `start`: (string) Determines when the event starts (e.g., `startNow`).
    - `userName`: (string) Name of the organizer.

  - **Sub-collections**:
    -

 **Collection: `images`**
      - **Document Fields**:
        - `owner`: (string) Name of the participant who took the photo.
        - `timestamp`: (number) Unix timestamp of when the photo was taken.
        - `url`: (string) URL of the photo stored in Firebase Storage.
    - **Collection: `participants`**
      - **Document Fields**:
        - `name`: (string) Name of the participant.
        - `role`: (string) Role in the event (e.g., `organizer`).
        - `userId`: (string) Unique identifier for the participant.

### 5.2 **Firebase Storage Structure**

- **Folder: `eventId` (e.g., `Also_1725111327712`)**
  - **Files**: 
    - Photos are stored as `userNameX.jpg` where `X` is the sequence number (e.g., `Frfe1.jpg`).
    - Each file is stored with metadata linking it to the participant who took the photo.

## 6. **App Clips Setup**

### 6.1 **Associated Domains**

- **Purpose**: Ensure that the App Clip can be accessed via the generated QR codes and associated domains.
- **Setup**:
  - **Domain**: `disposableapp.xyz`
  - **Associated Domains**: Defined in the Apple Developer account and linked to the app through the AASA file.

### 6.2 **AASA File Configuration**

- **Purpose**: The Apple App Site Association (AASA) file is necessary for configuring the associated domains for the App Clip.
- **Hosted By**: Cloudflare.
- **AASA File Example**:
  ```javascript
  export default {
    async fetch(request, env, ctx) {
      const aasaContent = {
        "applinks": {
          "apps": [],
          "details": [
            {
              "appIDs": ["<APP_ID>.com.moonshot.disposable.Clip"],
              "paths": ["/clip/*"]
            }
          ]
        },
        "webcredentials": {
          "apps": ["<APP_ID>.com.moonshot.disposable.Clip"]
        },
        "appclips": {
          "apps": ["<APP_ID>.com.moonshot.disposable.Clip"]
        }
      };

      const jsonBody = JSON.stringify(aasaContent);

      return new Response(jsonBody, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      });
    },
  };
  ```

## 7. **Security Considerations**

- **Data Encryption**:
  - All data at rest (in Firebase Storage and Firestore) and in transit is encrypted using industry-standard protocols (e.g., TLS/SSL).
- **Access Control**:
  - No authentication is implemented for user access, simplifying the user experience but relying on local device security.
- **Data Privacy**:
  - Compliant with GDPR, ensuring that users’ data can be accessed, rectified, and deleted upon request.
- **Domain Security**:
  - SSL certificates are managed by Cloudflare to secure communication between the app, the backend, and associated domains.

## 8. **Performance and Scalability**

### 8.1 **Performance**
- **App Performance**:
  - The app is optimized to load quickly, with an initial launch time target of under 3 seconds.
- **Real-Time Updates**:
  - Firestore’s real-time capabilities are leveraged to ensure that all participants see updates (e.g., new photos) as soon as they occur.

### 8.2 **Scalability**
- **User Capacity**:
  - The system is currently designed for limited traffic but can be scaled by leveraging Firebase’s infrastructure to handle more users.
- **Event Data Handling**:
  - Efficient data handling strategies, including the use of Firestore’s real-time listeners, ensure that even large volumes of photos can be managed without performance degradation.

## 9. **Deployment**

### 9.1 **Deployment Process**
- **Expo CLI**:
  - Used to build and deploy the React Native app. The command `npx expo prebuild --platform ios` prepares the app for deployment.
- **Xcode**:
  - Required for building and deploying the App Clip. The app and the App Clip are both submitted to the App Store via Xcode.
- **Cloudflare Workers**:
  - Deployed using the command `npm run deploy` to ensure the AASA file and other configurations are served correctly.

### 9.2 **Continuous Integration/Continuous Deployment (CI/CD)**
- **GitHub Actions**:
  - Potential for future integration with GitHub Actions to automate testing, building, and deployment processes.

## 10. **Testing and Quality Assurance**

### 10.1 **Unit Testing**
- **Tools**:
  - Jest is used for unit testing of React components and other JavaScript logic.
  - XCTest is used for testing the Swift code in the App Clip.

### 10.2 **Integration Testing**
- **Tools**:
  - Detox or Cypress can be used for end-to-end testing of the app’s flows, ensuring that the interaction between the frontend and backend works as expected.

### 10.3 **User Acceptance Testing (UAT)**
- **Process**:
  - Conducted by real users to ensure the app meets the business requirements and provides a seamless user experience.
  - Feedback from UAT will be incorporated into the development cycle for further improvements.

## 11. **Documentation and Maintenance**

### 11.1 **Code Documentation**
- **Location**: All code is documented inline, with further documentation stored in the GitHub repository’s Wiki.
- **Details**: Includes explanations of key functions, architecture decisions, and deployment instructions.

### 11.2 **User Documentation**
- **Purpose**: Guides for end-users and administrators on how to use the app’s features, available on the app’s website.
- **Feedback Mechanism**:
  - Users can provide feedback directly through the app or via the website, enabling continuous improvement.

### 11.3 **Maintenance**
- **Process**: 
  - Regular updates will be released to fix bugs, improve performance, and introduce new features based on user feedback.
  - Maintenance cycles will be managed via GitHub and communicated to users through release notes.

# Glossary

- **AASA (Apple App Site Association) File**: A JSON file hosted on a web server that iOS uses to associate domain names with apps, enabling features like Universal Links and App Clips.

- **App Clip**: A lightweight version of an iOS app that allows users to access key functionalities without downloading the full app, typically launched via URLs, NFC tags, or QR codes.

- **Associated Domains**: A feature in iOS that allows apps to associate with specific domain names, enabling functionalities such as Universal Links and App Clips.

- **Backend**: The server-side component of an application responsible for business logic, database management, and integration with other services.

- **CI/CD (Continuous Integration/Continuous Deployment)**: A set of practices that automate testing and deployment processes, ensuring that code changes are rapidly and reliably deployed to production environments.

- **Cloudflare**: A web infrastructure and security company providing services such as content delivery networks, DDoS mitigation, internet security, and domain name management.

- **Cloudflare Workers**: A serverless platform offered by Cloudflare that allows developers to run JavaScript applications at the network edge, used here to serve the AASA file.

- **Expo**: A framework and platform for developing React Native applications, providing tools and services for simplifying development, testing, and deployment processes.

- **Firebase**: A platform developed by Google that provides backend services like Firestore, a NoSQL database, and Firebase Storage for media storage, used in this project.

- **Firestore**: A NoSQL document database provided by Firebase, used to store and sync data in real-time for mobile and web applications.

- **Firestore Collections**: A method of organizing and storing groups of documents in Firestore, each collection containing multiple documents.

- **Firestore Documents**: Individual records within a Firestore collection, containing data as key-value pairs.

- **Firestore Sub-collections**: Collections within a document in Firestore, allowing for hierarchical organization of data.

- **GitHub**: A platform for version control and collaboration, enabling developers to manage and track changes in source code while supporting collaborative development.

- **GoDaddy**: A domain registrar and web hosting service used to manage the domain `disposableapp.xyz`.

- **Jest**: A JavaScript testing framework used for unit testing, primarily focused on testing React components and other JavaScript logic.

- **React Native**: A framework for building mobile applications that render natively on iOS and Android, using JavaScript and React.

- **Swift**: A programming language developed by Apple for building software across Apple’s ecosystem, including iOS, macOS, watchOS, and tvOS.

- **SwiftUI**: A framework by Apple for building user interfaces across Apple platforms using Swift, focusing on declarative syntax.

- **TLS/SSL (Transport Layer Security/Secure Sockets Layer)**: Protocols for encrypting data sent over the internet, ensuring secure communication between clients and servers.

- **UAT (User Acceptance Testing)**: The process where end-users test the application to ensure it meets business requirements and is ready for production.

- **URL (Uniform Resource Locator)**: The address used to access resources on the internet, such as web pages or App Clips.

- **Visual Studio Code**: A code editor optimized for building and debugging modern web and cloud applications, widely used for developing React Native apps.

- **Xcode**: Apple’s integrated development environment (IDE) for developing software for macOS, iOS, watchOS, and tvOS, including tools for testing and deployment.