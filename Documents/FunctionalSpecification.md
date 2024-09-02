# Disposable Camera Application - Functional Specification

## Table of Contents

<details>
<summary>Expand to view</summary>

- [Disposable Camera Application - Functional Specification](#disposable-camera-application---functional-specification)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Project Definition](#project-definition)
    - [Vision](#vision)
    - [Objectives](#objectives)
    - [Scope](#scope)
      - [All Users (Both Organizer and Participant)](#all-users-both-organizer-and-participant)
      - [Admin Users (Organizer)](#admin-users-organizer)
      - [Participant Users (Full App)](#participant-users-full-app)
      - [Participant Users (App Clip)](#participant-users-app-clip)
    - [Out of Scope](#out-of-scope)
  - [Project Organisation](#project-organisation)
    - [Stakeholders](#stakeholders)
    - [Timeline](#timeline)
    - [Milestones](#milestones)
    - [Risks and Assumptions](#risks-and-assumptions)
      - [Risks](#risks)
      - [Assumptions](#assumptions)
    - [Constraints](#constraints)
  - [Functional Requirements](#functional-requirements)
    - [Features Overview](#features-overview)
    - [Features Breakdown](#features-breakdown)
      - [1. **Download the App**](#1-download-the-app)
      - [2. **Event Creation**](#2-event-creation)
      - [3. **Event Parameter Definition**](#3-event-parameter-definition)
      - [4. **QR Code Generation**](#4-qr-code-generation)
      - [5. **QR Code Sharing**](#5-qr-code-sharing)
      - [6. **General Gallery Access**](#6-general-gallery-access)
      - [7. **General Gallery Saving**](#7-general-gallery-saving)
      - [8. **Personal Gallery Access**](#8-personal-gallery-access)
      - [9. **Personal Gallery Deletion**](#9-personal-gallery-deletion)
      - [10. **Personal Gallery Saving**](#10-personal-gallery-saving)
      - [11. **Photo Capture**](#11-photo-capture)
      - [12. **Photo Sharing**](#12-photo-sharing)
      - [13. **Photo Downloading**](#13-photo-downloading)
      - [14. **App Access Without Download**](#14-app-access-without-download)
      - [15. **Internet Connectivity Requirement**](#15-internet-connectivity-requirement)
      - [16. **Real-Time Updates**](#16-real-time-updates)
      - [17. **Customer Support Access**](#17-customer-support-access)
      - [18. **Permission Prompting**](#18-permission-prompting)
      - [19. **User Data Management**](#19-user-data-management)
    - [User Roles and Permissions Matrix](#user-roles-and-permissions-matrix)
    - [User Interface and Design](#user-interface-and-design)
  - [Target Audience](#target-audience)
    - [Personas](#personas)
    - [Use Cases](#use-cases)
  - [Functional Analysis](#functional-analysis)
  - [Non-Functional Requirements](#non-functional-requirements)
    - [Reliability](#reliability)
    - [Performance](#performance)
    - [Scalability](#scalability)
    - [Security](#security)
    - [Usability](#usability)
    - [Operability](#operability)
    - [Recovery](#recovery)
    - [Delivery](#delivery)
    - [Maintainability](#maintainability)
  - [User Flows](#user-flows)
    - [Onboarding Flow](#onboarding-flow)
    - [App Clip Flow](#app-clip-flow)
  - [Legal and Compliance Requirements](#legal-and-compliance-requirements)
  - [Analytics and Reporting](#analytics-and-reporting)
  - [Localization and Internationalization](#localization-and-internationalization)
  - [Integration with Other Services](#integration-with-other-services)
  - [User Testing and Feedback](#user-testing-and-feedback)
  - [Future Enhancements and Roadmap](#future-enhancements-and-roadmap)
  - [Glossary](#glossary)

</details>

## Project Overview

The Disposable Camera application aims to provide users with a nostalgic and communal experience of capturing and sharing moments at events. Inspired by traditional disposable cameras, the app offers a user-friendly interface that allows participants to take photos, share them with others, and create lasting memories.

Participants can access the app through an App Clip, which allows them to join events and participate without downloading the full app. Each event has its own gallery where photos are automatically shared with all attendees, fostering a communal experience. Initially designed for iOS, the app is intended to be cross-platform compatible in future iterations.

## Project Definition

### Vision

The vision for the Disposable Camera application is to create a user-friendly mobile app that facilitates the capturing and sharing of memorable moments during events. By leveraging the nostalgic appeal of disposable cameras and combining it with modern technology, the app enhances event experiences, fostering greater interaction among attendees.

The app is designed to be intuitive and accessible, catering to users of all ages, with a particular focus on simplifying the user experience for older individuals. By enabling access through an App Clip and limiting the number of photos each participant can take, the app encourages users to be more present and engaged during events.

### Objectives

1. **Enhance Accessibility**: Ensure the app is intuitive and user-friendly, making it accessible to users of all ages.
2. **Seamless Access**: Utilize App Clips to allow participants to join events and share photos without needing to download the full app.
3. **Foster Engagement**: Limit photo-taking to encourage mindfulness and selective capturing of moments.
4. **Facilitate Instant Sharing**: Automatically share photos in a communal event gallery.
5. **Cross-Platform Compatibility**: Start with iOS and expand to other platforms in future iterations.
6. **Promote Inclusivity**: Create an inclusive app that fosters meaningful connections among attendees.
7. **Enhance Event Experience**: Combine modern technology with nostalgic elements to enrich event experiences.

### Scope

#### All Users (Both Organizer and Participant)

Taking photos:
-   Capture photos using the app's camera interface during the event (Full App only).
-   Change camera side.
-   Use the flash.

Access to the general gallery:
-   Share photos taken during the event with other participants and admin users.
-   View and browse photos shared by all participants in the event's general gallery.
-   Download event photos shared by other participants or admin users for personal use.

Connected to the internet:
-   Require an active internet connection for users to access the app's features and functionalities, such as event participation and photo sharing.

Constant refresh:
-   Implement real-time updates and automatic refresh functionalities to ensure that users have access to the latest event information and shared photos.

Customer support:
-   Provide access to customer support resources within the app, such as FAQs, help guides, and contact information, to assist users with any issues or inquiries.

Asking for permission from users:
-   Prompt users for permission before accessing sensitive device features or personal data, such as camera access, location information, and contact details.

Giving users access to their data:
-   Enable users to access and manage their data stored within the app, such as profile information, event history, and shared photos.

#### Admin Users (Organizer)

Creation of an event:
-   Ability to create new events within the app.
-   Define event parameters and settings, including maximum photo limits and event duration.

Sharing a QR code:
-   Generate a unique QR code linked to each event for participant access.
-   Allow admin users to share the QR code via various channels (e.g., email, messaging) to invite participants.

Access to the general and personal galleries:
-   Going through all photos shared within the app's general gallery.

#### Participant Users (Full App)

Joining an event:
-   Participants can join an event by clicking the "Join Event" button and entering the event ID.
-   Participants must refer their name when joining an event.

Event participation:
-   Participants can take photos during the event, download photos, or leave the event.
-   Participants have access to both their personal gallery and the general gallery of the event.

Leaving an event:
-   Participants can choose to leave the event at any time.

#### Participant Users (App Clip)

Joining an event:
-   Participants can join an event by scanning a QR code using their device’s camera, which will open the App Clip.
-   Participants must refer their name when accessing the event through the App Clip.

Event participation:
-   Participants can only download and upload photos within the event.
-   The App Clip does not require the participant to download the full app, and it provides access to the general event gallery only.


### Out of Scope

The following features are not included in the current version of the Disposable Camera app but may be considered for future releases:

-   **Editable Event Duration**: The duration of events cannot be modified once created.
-   **Customizable Number of Photos per User**: The number of photos each user can take is fixed.
-   **Adjustable Photo Release Timing**: The timing for releasing photos cannot be altered after the event is created.
-   **Video Capture**: The app does not support video recording.
-   **Photo Filters**: Users cannot apply filters to photos.
-   **Location Tracking**: The app does not collect or display location information.
-   **Instagram Integration**: Users cannot share photos directly to Instagram from the app.
-   **Event Templates**: There are no predefined templates for creating events.
-   **Multiple Admin Roles**: Each event is managed by a single admin.
-   **Pre-scheduled Events**: Events cannot be scheduled in advance.
-   **Live Streaming**: The app does not support live streaming of events.
-   **Virtual Reality Integration**: VR features are not included.
-   **Reward System**: The app does not offer rewards or badges for users.

## Project Organisation

### Stakeholders

| Stakeholder       | Role                                  |
|-------------------|---------------------------------------|
| Clémentine CUREL  | Lead and manage the project           |
| ALGOSUP           | Provides academic guidance            |
| Reviewers         | Evaluate the project for grading      |

### Timeline
// todo
Project management, task allocation, and progress tracking are coordinated using [JIRA](https://virtual-processor.atlassian.net/jira/core/projects/MS/summary).

### Milestones

| Milestone        | Description                                       |
|------------------|---------------------------------------------------|
| Functional       | Completion of functional requirements and features|
| Technical        | Implementation of technical architecture          |
| Roadmap          | Development plan for future iterations            |
| V1               | Release of the first version of the application   |
| Jury 1           | Presentation and evaluation by the first jury     |
| User Testing     | Conducting user testing and gathering feedback    |
| V2               | Release of the second version of the application  |
| Jury 2           | Presentation and evaluation by the final jury     |

### Risks and Assumptions

#### Risks

- **Technical Issues**: Potential bugs may delay progress or affect functionality.
- **Scope Creep**: Expanding scope may increase workload and delay completion.
- **Resource Constraints**: Limited budget and expertise could impact deadlines.
- **Compatibility Issues**: Cross-platform compatibility might present challenges.
- **User Adoption**: Low engagement could impact the app’s success.
- **Data Security Breaches**: Security vulnerabilities could compromise user data.
- **Regulatory Compliance**: Failure to comply with laws could result in legal issues.
- **External Dependencies**: Reliance on third-party services may introduce risks.

#### Assumptions

- Users have access to smartphones with compatible operating systems.
- Users have a stable internet connection.
- Users are familiar with mobile applications.
- Event participants actively engage with the app.
- Users consent to sharing their photos within the app.

### Constraints

**Resource Constraints**: Limited budget for software licenses.

**Time Constraints**: Strict deadlines imposed by academic institutions.

**Legal and Regulatory Constraints**: Compliance with GDPR and other regulations.

## Functional Requirements

### Features Overview

1. **Download the App**: Available initially on iOS, downloadable from the App Store.
2. **Event Creation**: Create events and define the parameters; event is created immediately upon validation.
3. **Event Parameter Definition**: Define event parameters such as duration, maximum photo limits, and other settings.
4. **QR Code Generation**: Generate a unique QR code linking to the event’s App Clip.
5. **QR Code Sharing**: Admin users can share the QR code via various channels (e.g., email, messaging) to invite participants.
6. **General Gallery Access**: Users can access the general gallery to view shared photos.
7. **General Gallery Saving**: Users can save photos from the general gallery to their devices.
8. **Personal Gallery Access**: Users can access their gallery to view their own shared photos.
9. **Personal Gallery Deletion**: Users can delete photos from their gallery.
10. **Personal Gallery Saving**: Users can save photos from their gallery to their devices.
11. **Photo Capture**: Users can capture photos using the app's camera interface.
12. **Photo Sharing**: Participants and organizer users can share event photos within the app.
13. **Photo Downloading**: Users can download event photos shared by others.
14. **App Access Without Download**: Participants can access event features without downloading the app.
15. **Internet Connectivity Requirement**: Require an active internet connection for users to access app features.
16. **Real-Time Updates**: Provide real-time updates and automatic refreshes for the latest event information.
17. **Customer Support Access**: Offer access to customer support resources within the app.
18. **Permission Prompting**: Prompt users for permission before accessing sensitive device features or personal data.
19. **User Data Management**: Enable users to access and manage their personal data.


### Features Breakdown

#### 1. **Download the App**

-   **Description**: Users can download the app from the App Store. Initially, the app is available only on iOS.
-   **Requirements**:
    -   App Store listing must be created with accurate descriptions, screenshots, and metadata.
    -   Ensure the app meets all App Store guidelines.

#### 2. **Event Creation**

-   **Description**: Admin users can create new events within the app. Events are created immediately upon clicking the validation button.
-   **Requirements**:
    -   Event creation interface must allow users to define parameters like duration, maximum photo limits, etc.
    -   Once created, events should generate a unique identifier (Event ID).

#### 3. **Event Parameter Definition**

-   **Description**: Admin users can define specific parameters for each event, such as duration, maximum number of photos per participant, and other customizable settings.
-   **Requirements**:
    -   Interface should allow for easy input of event parameters.
    -   Parameters should be editable until the event is finalized.

#### 4. **QR Code Generation**

-   **Description**: The app generates a unique QR code for each event, linking directly to the event’s App Clip.
-   **Requirements**:
    -   QR codes must be dynamically generated and linked to specific event IDs.
    -   QR codes should be compatible with standard QR code readers.

#### 5. **QR Code Sharing**

-   **Description**: Admin users can share the event QR code through various communication channels, such as email or messaging apps.
-   **Requirements**:
    -   Integration with device sharing features (e.g., iOS Share Sheet).
    -   Ensure QR codes are accessible and can be scanned by participants.

#### 6. **General Gallery Access**

-   **Description**: Participants can view all photos shared in the event's general gallery.
-   **Requirements**:
    -   Gallery interface should display photos in a grid format.
    -   Implement scrollable or paginated views for easy navigation.

#### 7. **General Gallery Saving**

-   **Description**: Users can save photos from the general gallery directly to their devices.
-   **Requirements**:
    -   Implement photo-saving functionality with appropriate permissions.
    -   Ensure photos are saved in a standard format (e.g., JPEG).

#### 8. **Personal Gallery Access**

-   **Description**: Users can access their personal gallery to view photos they have uploaded or taken during the event.
-   **Requirements**:
    -   Personal gallery should be accessible from the user’s profile or a dedicated section within the app.
    -   Photos should be organized by event.

#### 9. **Personal Gallery Deletion**

-   **Description**: Users can delete photos from their personal gallery.
-   **Requirements**:
    -   Implement a confirmation prompt before deletion.
    -   Ensure that deleted photos are removed from the app’s storage and not recoverable.

#### 10. **Personal Gallery Saving**

-   **Description**: Users can save photos from their personal gallery to their devices.
-   **Requirements**:
    -   Provide a straightforward option to download and save images.
    -   Ensure images retain their original quality during the saving process.

#### 11. **Photo Capture**

-   **Description**: Users can take photos using the app’s built-in camera interface during an event.
-   **Requirements**:
    -   The camera interface must include essential features such as shutter control, switching between front and rear cameras, and enabling/disabling the flash.
    -   Ensure the captured photos are automatically saved to the event’s gallery.

#### 12. **Photo Sharing**

-   **Description**: Both participants and organizers can share photos within the event, making them accessible in the general gallery.
-   **Requirements**:
    -   Implement an easy-to-use photo sharing feature.
    -   Photos should be instantly available to other participants in the general gallery.

#### 13. **Photo Downloading**

-   **Description**: Users can download photos shared by others within the event.
-   **Requirements**:
    -   Allow users to select and download multiple photos at once.
    -   Ensure that downloading photos respects the event’s privacy settings.

#### 14. **App Access Without Download**

-   **Description**: Participants can join events and access basic features without downloading the full app, using the App Clip.
-   **Requirements**:
    -   App Clip should offer essential features such as viewing the general gallery, uploading, and downloading photos.
    -   Ensure the App Clip is lightweight and complies with size limitations.

#### 15. **Internet Connectivity Requirement**

-   **Description**: An active internet connection is required to access most features of the app, including event participation, photo sharing, and gallery access.
-   **Requirements**:
    -   Implement checks for active internet connectivity.
    -   Provide user-friendly error messages or offline prompts when the internet is unavailable.

#### 16. **Real-Time Updates**

-   **Description**: The app provides real-time updates for the latest event information, such as newly shared photos.
-   **Requirements**:
    -   Ensure the app’s UI automatically refreshes to display new content.

#### 17. **Customer Support Access**

-   **Description**: Users can access customer support resources directly within the app.
-   **Requirements**:
    -   Include a dedicated support section with FAQs, a help guide, and contact options.
    -   Consider integrating live chat or a ticketing system for direct user support.

#### 18. **Permission Prompting**

-   **Description**: The app prompts users for permission before accessing sensitive device features or personal data, such as the camera or photo gallery.
-   **Requirements**:
    -   Permissions must be requested at appropriate times (e.g., when first using the camera).
    -   Provide clear explanations for why permissions are needed and how they will be used.

#### 19. **User Data Management**

-   **Description**: Users can access and manage their personal data within the app, including photos and event participation history.
-   **Requirements**:
    -   Provide a user-friendly interface for managing personal data.
    -   Include options for users to delete their data, including account deactivation or deletion.

### User Roles and Permissions Matrix

This matrix outlines what each user role can do within the Disposable Camera application, both in the full app and the App Clip version.

| **Feature/Functionality**            | **Organizer (Full App)** | **Participant (Full App)** | **App Clip User**     |
|--------------------------------------|--------------------------|----------------------------|-----------------------|
| **Event Creation**                   | Yes                      | No                         | No                    |
| **QR Code Generation**               | Yes                      | No                         | No                    |
| **Photo Capture (Camera Access)**    | Yes                      | Yes                        | No                    |
| **Photo Upload (Gallery Access)**    | Yes                      | Yes                        | Yes                   |
| **Photo Download**                   | Yes                      | Yes                        | Yes                   |
| **View Personal Gallery**            | Yes                      | Yes                        | No                    |
| **View General Event Gallery**       | Yes                      | Yes                        | Yes                   |
| **Manage Photos (Delete/Edit)**      | Yes (Own Photos)         | Yes (Own Photos)           | No                    |                |
| **Settings Access**                  | Yes                      | Yes                        | No                    |
| **Name/Pseudo Prompt**               | No                       | Yes                        | Yes                   |
| **Post-Event Access (30 Days)**      | Yes                      | Yes                        | Yes                   |

### User Interface and Design

To explore the mock-up of the Disposable Camera App, you can click on this [Figma link](https://www.figma.com/design/Y0JWQtRMokJs5hnwLF1sDu/DISPOSABLE-MOCK-UP?node-id=0-1&t=uNiJCGJkkmKKLWKL-1).

Graphic charter:

<img src="./Images/GraphCharter.png" style="width: 60%">


## Target Audience

### Personas

1. **Margaret**: An elderly woman who wants to collect photos from her grandson’s baptism.

<img src="./Images/1.png" style="width: 50%">

2. **Sarah**: A young mother capturing candid moments during Christmas.

<img src="./Images/2.png" style="width: 50%">

3. **James**: A groom wanting to enhance guest engagement at his wedding.

<img src="./Images/3.png" style="width: 50%">

4. **Emily**: A social media-savvy individual capturing her anniversary party.

<img src="./Images/4.png" style="width: 50%">

5. **Alex**: A meticulous planner organizing a successful party.

<img src="./Images/5.png" style="width: 50%">

### Use Cases

1. **Margaret's Baptism Photos**
   - **Actor**: Margaret
   - **Description**: Margaret desires to receive photos of all participants at her grandson's baptism, as she lacks photography skills and financial resources to hire a professional. She aims to ensure comprehensive coverage of the event by obtaining photos taken by others.
   - **Preconditions**: Margaret has access to the app through the App Clip or full app.
   - **Postconditions**: Margaret successfully collects photos from other participants, enhancing the coverage of her grandson's baptism.
   - **Flow**: 
     - Margaret attends her grandson's baptism, equipped with the Disposable Camera app.
     - Aware of her limitations in capturing photos, Margaret interacts with other attendees and encourages them to take photos with the app during the event.
     - Throughout the ceremony, Margaret communicates her desire to receive copies of photos taken by other participants.
     - As a result, Margaret receives a variety of photos taken by different individuals, enriching the coverage of her grandson's baptism and ensuring she has memories captured from various perspectives.

2. **Sarah's Christmas Celebration**
   - **Actor**: Sarah
   - **Description**: Sarah aims to capture candid moments during her family's Christmas celebration using the Disposable Camera app.
   - **Preconditions**: Sarah has shared the QR code of the Disposable Camera app with family members.
   - **Postconditions**: Sarah collects digital photos

 taken during the celebration via the Disposable Camera app and compiles them for a family album.
   - **Flow**:
     1. Before the Christmas celebration, Sarah shares the QR code of the Disposable Camera app with family members, warning them that they don't have to download the app.
     2. Throughout the event, family members use the Disposable Camera app to capture candid moments, such as opening presents, sharing meals, and playing games.
     3. After the celebration, Sarah collects the digital photos taken by family members using the Disposable Camera app.
     4. Sarah compiles the digital photos into a digital or printed family album, preserving the memories of the Christmas celebration captured through the app.

3. **James's Wedding Engagement**
   - **Actor**: James
   - **Description**: James aims to enhance guest engagement at his wedding by providing a virtual disposable camera experience through the Disposable Camera app.
   - **Preconditions**: James has created an event on the Disposable Camera app and shared the event QR code with wedding guests.
   - **Postconditions**: James collects digital photos taken during the wedding celebration via the Disposable Camera app and compiles them for a keepsake album.
   - **Flow**:
     1. Before the wedding ceremony, James creates an event on the Disposable Camera app and shares the event QR code with wedding guests via email, text message, or printed cards.
     2. Guests attend the wedding reception and use their smartphones to scan the event QR code and access the Disposable Camera app without downloading it.
     3. Throughout the wedding festivities, guests use the Disposable Camera app to capture candid photos of themselves, the bride and groom, and other guests.
     4. After the wedding, James collects the digital photos taken by guests using the Disposable Camera app.
     5. James compiles the digital photos into a keepsake album, preserving the memories of his special day captured through the app.

4. **Emily's Anniversary Party**
   - **Actor**: Emily
   - **Description**: Emily wants to capture fun moments during her anniversary party using the Disposable Camera app and share them on Instagram.
   - **Preconditions**: Emily has created an event on the Disposable Camera app and shared the event QR code with party attendees. Emily has an Instagram account.
   - **Postconditions**: Emily posts digital photos taken during the anniversary party via the Disposable Camera app on her Instagram profile.
   - **Flow**:
     1. Before the anniversary party, Emily creates an event on the Disposable Camera app and shares the event QR code with party attendees.
     2. Guests attend the anniversary party and use their smartphones to scan the event QR code and access the Disposable Camera app without downloading it.
     3. Throughout the party, Emily and her friends use the Disposable Camera app to capture photos of themselves, their activities, and the decorations.
     4. After the party, Emily collects the digital photos taken by guests using the Disposable Camera app.
     5. Emily selects the best photos from the event and edits them if necessary (on another app).
     6. Emily posts the edited photos on her Instagram profile, adding captions and hashtags to share the memories of her anniversary celebration with her followers.

5. **Alex's Party Planning**
   - **Actor**: Alex
   - **Description**: Alex wants to ensure a successful party by coordinating various aspects of planning and execution using the Disposable Camera app.
   - **Preconditions**: Alex has access to resources for party planning and coordination.
   - **Postconditions**: The party is executed smoothly, and attendees have an enjoyable experience.
   - **Flow**:
     1. Alex begins by setting a date and theme for the party and creates an event on the Disposable Camera app.
     2. Alex shares the event QR code with invited guests, allowing them to access the Disposable Camera app without downloading it.
     3. Alex organizes logistics such as decorations, food and drinks, and entertainment, updating the event details on the Disposable Camera app.
     4. On the day of the party, Alex uses the Disposable Camera app to capture photos of the setup, guests, and activities, contributing to the event's digital album.
     5. Throughout the party, Alex encourages guests to use the Disposable Camera app to capture their own photos and share them within the event album.
     6. After the party, Alex reviews the photos collected through the Disposable Camera app, sharing highlights with attendees and preserving memories of the event digitally.

## Functional Analysis

**Legend:** 

<img src="./Images/Legend.png" style="width: 50%">

<br>

**Authentication:**

<img src="./Images/Authentication.png" style="width: 50%">

<br>

**Home screen:**

<img src="./Images/Home.png" style="width: 50%">

<br>

**Camera:**

<img src="./Images/Camera.png" style="width: 50%">

<br>

**Personal gallery:**

<img src="./Images/Personal.png" style="width: 50%">

<br>

**Personal settings:**

<img src="./Images/SettingsPerso.png" style="width: 50%">

<br>

**General gallery:**

<img src="./Images/General.png" style="width: 50%">

<br>

**Create event:**

<img src="./Images/Create.png" style="width: 50%">

<br>

**Event Settings:**

<img src="./Images/SettingsEvent.png" style="width: 50%">

<br>


## Non-Functional Requirements

### Reliability
- **Uptime**: The app should have an uptime of 99.9%, ensuring minimal downtime.
- **Error Handling**: Gracefully handle errors, providing user-friendly messages and avoiding crashes.
- **Data Consistency**: Ensure consistency in photo uploads and downloads, even under network interruptions.

### Performance
- **Loading Times**: The app must load quickly, with initial launch times under 3 seconds.
- **Real-Time Updates**: Ensure real-time updates for new photos and event information.

### Scalability
- **User Capacity**: Support a large number of simultaneous users, especially during large events.
- **Event Data Handling**: Efficiently manage a large volume of photos without performance degradation.

### Security
- **Data Encryption**: Use industry-standard encryption for data at rest and in transit.
- **GDPR Compliance**: Ensure compliance with GDPR for user data privacy.
- **Access Control**: Restrict access to photos and data based on user roles.

### Usability
- **User Interface**: Design an intuitive UI that is easy to navigate.
- **Accessibility**: Include basic accessibility features for users with disabilities.

### Operability
- **Cross-Platform Consistency**: Ensure the design is adaptable for future cross-platform support.
- **Ease of Maintenance**: Maintain a well-documented codebase for easy updates.

### Recovery
- **Data Integrity**: Ensure no data is lost in case of crashes; use automatic backups.
- **Crash Recovery**: The app should restart and recover to a stable state after a crash.

### Delivery
- **App Store Compliance**: Ensure the app complies with Apple App Store guidelines.
- **Update Process**: Support over-the-air updates with minimal user disruption.

### Maintainability
- **Code Documentation**: Ensure all code is well-documented.
- **Version Control**: Use GitHub for version control to track and manage changes.

## User Flows

### Onboarding Flow

1. **Download the App**:
   - User downloads the app from the App Store.
   - On first launch, the user is greeted with a brief introduction to the app’s features.
   - The user is asked to allow access to the camera and photo library.
   - For organizers, a quick tutorial on how to create an event is provided.

2. **Event Creation (Organizer)**:
   - Organizer selects "Create Event" from the home screen.
   - Fills out event details (name, photo limit, duration).
   - The app generates a unique QR code for the event.
   - The QR code is displayed and can be shared with participants.

3. **Event Participation (Participant)**:
   - Participant scans the event QR code using their phone’s camera.
   - If using the full app, they are directed to the event gallery.
   - If using the App Clip, they are prompted to enter their name/pseudo before accessing the gallery.

### App Clip Flow

1. **Scanning the QR Code**:
   - User scans the event QR code using their phone’s native camera.
   - The App Clip is launched immediately without the need for a full download.

2. **Entering Name/Pseudo**:
   - Upon first use, the App Clip prompts the user to enter their name or pseudo.
   - This information is used to personalize their experience during the event.

3. **Accessing the Event Gallery**:
   - The user is presented with a unified gallery view showing all event photos.
   - The user can browse existing photos and choose to download them.

4. **Uploading Photos**:
   - The user can upload photos directly from their device’s gallery.
   - The App Clip will request access to the user’s photo library for this purpose.

5. **Exiting the App Clip**:
   - The user can exit the App Clip at any time by closing it.
   - Data (such as name/pseudo) is retained only for the session unless saved by the full app.

## Legal and Compliance Requirements

- **GDPR Compliance**: Ensure the app adheres to GDPR regulations, including user consent for data collection and the right to access, rectify, and delete personal data.
- **Terms of Service and Privacy Policy**: Users must agree to the app’s terms of service and privacy policy upon first use. The policies should be accessible at any time within the app.
- **Data Retention Policy**: Specify that event data will be retained for 30 days post-event, after which it will be permanently deleted.

## Analytics and Reporting

- **User Engagement**: Track how users interact with the app, including time spent on different screens, the number of photos uploaded/downloaded, and participation rates.
- **Event Metrics**: Provide organizers with basic analytics, such as the number of photos uploaded and the number of active participants.
- **Crash Reports**: Collect and analyze crash reports to identify and address stability issues.

## Localization and Internationalization

- **Language Support**: Initially, the app will support English,

 with plans to add additional languages based on user demand.
- **Date/Time Formats**: Ensure that date and time formats are localized based on the user’s region.
- **Cultural Sensitivity**: Ensure that the app’s content, including icons and color schemes, is culturally appropriate for different regions.

## Integration with Other Services

- **Cloud Storage**: Use cloud storage for storing event photos, ensuring scalability and reliability.
- **Social Media Sharing**: In future iterations, consider integrating social media sharing directly from the app.
- **Analytics Platforms**: Integrate with analytics platforms to track user behavior and app performance.

## User Testing and Feedback

- **User Testing Plan**: Conduct user testing with a diverse group of participants, including those with different levels of tech-savviness.
- **Feedback Collection**: Provide in-app mechanisms for users to submit feedback and report issues.
- **Iteration and Improvement**: Use the collected feedback to prioritize improvements in future updates.

## Future Enhancements and Roadmap

- **Cross-Platform Expansion**: Expand the app to Android and potentially other platforms based on demand.
- **Video Capture**: Consider adding video capture functionality in a future version.
- **Event Templates**: Introduce pre-defined event templates to simplify event creation.
- **Multiple Admin Roles**: Allow for multiple organizers to manage a single event.
- **Rewards/Badge System**: Introduce a reward system for users who participate in multiple events.

## Glossary

- **Academic Institution**: An organization dedicated to education and research, providing guidance and assessment for the project.
- **App Clip**: A lightweight version of the app that provides key functionality without requiring a full download.
- **Cross-Platform**: The ability for software to run on multiple platforms, such as iOS and Android.
- **Data Security**: The protection of data against unauthorized access, corruption, or theft, using encryption and other measures.
- **Disposable Camera**: A traditional single-use camera that inspired the app’s design and functionality.
- **Event**: A specific occasion where participants can join, take photos, and share them through the app.
- **GDPR (General Data Protection Regulation)**: A regulation in EU law on data protection and privacy.
- **Intellectual Property**: Legal rights concerning the ownership of creations of the mind, such as software and content.
- **Milestones**: Key points in the project timeline marking significant progress.
- **Non-Functional Requirements**: Criteria used to judge the operation of a system, such as performance and reliability.
- **Personal Data**: Information relating to an identifiable person, such as photos and event participation data.
- **Project Management**: The process of planning and overseeing the development of the app.
- **QR Code**: A machine-readable code used for storing URLs or other information, scannable by smartphone cameras.
- **Regulatory Compliance**: Adherence to laws and regulations relevant to the app’s development and use.
- **Reviewers**: Individuals or groups responsible for evaluating the project’s compliance with required standards.
- **Risks and Assumptions**: Considerations regarding potential issues (risks) and conditions assumed to be true (assumptions) during project planning.
- **Scope**: The boundaries of the project, including what will be developed and what will be excluded.
- **Stakeholders**: Individuals or organizations with an interest in the project’s outcome.
- **Timeline**: The schedule for the project, including key dates and milestones.
- **User Interface (UI)**: The part of the app that users interact with, including design and navigation elements.

