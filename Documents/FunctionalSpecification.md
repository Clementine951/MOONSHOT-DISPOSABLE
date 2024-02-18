# Functional specification

<details>
<summary>Table of contents</summary>

- [Functional specification](#functional-specification)
- [Project Overview](#project-overview)
  - [Report Issues](#report-issues)
- [Project Definition](#project-definition)
  - [Vision](#vision)
  - [Objectives](#objectives)
  - [Scope](#scope)
    - [All Users (Both Admin and Participant)](#all-users-both-admin-and-participant)
    - [Admin Users](#admin-users)
    - [Participant Users](#participant-users)
  - [Out of Scope](#out-of-scope)
- [Project Organisation](#project-organisation)
- [Project Plan](#project-plan)
- [Functional Requirements](#functional-requirements)
  - [Features Overview](#features-overview)
  - [Features Breakdown](#features-breakdown)
    - [Ubiquitous Requirements](#ubiquitous-requirements)
    - [State-driven Requirements](#state-driven-requirements)
    - [Event-driven Requirements](#event-driven-requirements)
    - [Unwanted Behaviour Requirements](#unwanted-behaviour-requirements)
    - [Complex Requirements](#complex-requirements)
  - [User Interface and Design](#user-interface-and-design)
- [Target Audience](#target-audience)
  - [Personas](#personas)
  - [User Cases](#user-cases)
  - [User Journey](#user-journey)
  - [Functional Analysis](#functional-analysis)
- [Non-Functional Requirements](#non-functional-requirements)
  - [Costs](#costs)
  - [Reliability](#reliability)
  - [Operability](#operability)
  - [Recovery](#recovery)
  - [Delivery](#delivery)
  - [Maintainability](#maintainability)
  - [Security](#security)
- [Glossary](#glossary)

</details>

<br>

# Project Overview

The Disposable Camera application aims to provide users with a unique and nostalgic experience of capturing and sharing moments at events. Inspired by disposable cameras, the app offers a user-friendly interface for event participants to take photos, share them with others, and create lasting memories. With features like customisable camera settings, event galleries, and cross-platform compatibility, the app aims to enhance the event experience and promote engagement among attendees.

## Report Issues

If you notice errors in this document, or would like to give feedback, please file a Doc Issue in the MOONSHOT-DISPOSABLE GitHub repository: https://github.com/Clementine951/MOONSHOT-DISPOSABLE/issues

# Project Definition

## Vision

The vision for the Disposable Camera application project is to develop a user-friendly mobile application that facilitates effortless capturing and sharing of memorable moments during events, with a particular focus on enhancing accessibility for older individuals. By prioritising simplicity, intuitiveness, and inclusivity, the app aims to bridge generational gaps and foster meaningful connections among attendees, ensuring that everyone can participate fully in capturing and reliving event experiences.

## Objectives

- Capture and share moments
- Nostalgic experience
- User-friendly interface
- Cross-platform compatibility
- Enhanced engagement

## Scope
The scope of the project encompasses a set of features designed to facilitate the seamless creation, management, and participation in events through the Disposable Camera App. It's important to note that the scope features outlined below may be subject to revision based on user feedback and iterations following the completion of the first version of the app. This flexibility allows for continuous improvement and adaptation to user needs and preferences, as detailed in the functional requirements section.

### All Users (Both Admin and Participant)

Taking photos:
- Capture photos using the app's camera interface during the event.

Access to the general gallery:
- Share photos taken during the event with other participants and admin users.
- View and browse photos shared by all participants in the event's general gallery.
- Download event photos shared by other participants or admin users for personal use.

Secure and safe:
- Ensure that user data and interactions within the app are protected through robust security measures, such as encryption and secure authentication protocols.

Connected to the internet:
- Require an active internet connection for users to access the app's features and functionalities, such as event participation and photo sharing.

Constant refresh:
- Implement real-time updates and automatic refresh functionalities to ensure that users have access to the latest event information, shared photos, and notifications.

Customer support:
- Provide access to customer support resources within the app, such as FAQs, help guides, and contact information, to assist users with any issues or inquiries.
- 
Asking for permission from users:
- Prompt users for permission before accessing sensitive device features or personal data, such as camera access, location information, and contact details.

Sending notifications:
- Send push notifications to users to provide updates on event activities, new photo uploads, or important announcements related to their participation.

Giving users access to their data:
- Enable users to access and manage their data stored within the app, such as profile information, event history, and shared photos.

### Admin Users

Account creation:
- Provide admin users with the option to create an account within the app.
- Collect user information such as name, email, and password for account registration.

Creation of an event:
- Ability to create new events within the app.
- Define event parameters and settings, including maximum photo limits and event duration.

Sharing a QR code:
- Generate a unique QR code linked to each event for participant access.
- Allow admin users to share the QR code via various channels (e.g., email, messaging) to invite participants.

Access to the general and personal galleries:
- Manage all photos shared within the app's general gallery.

### Participant Users

Scanning a valid QR code:
- Scan the QR code associated with the event to gain access.
- Authenticate participant identity and grant event entry upon successful QR code scan.

Access to the personal gallery:
- Manage all photos shared within the app's gallery.
- Delete photos uploaded by the participant if needed.

No application download requirement:
- Allow participants to access event features without downloading the app.
- Enable participation and photo sharing via QR code scan without the need for app installation.

## Out of Scope

The out-of-scope features listed below represent functionalities that are not included in the current version of the Disposable Camera App. However, it's important to note that these features may be subject to revision based on user feedback and iterations following the completion of the first version of the app. This flexibility allows for continuous improvement and adaptation to user needs and preferences.

Duration of event uneditable:
- The duration of events cannot be edited once they are created.

Non-customisable number of photos per user:
- The number of photos per user, decided by the admin, cannot be customised or edited after the creation of the event.

Fixed release of photos:
- The release of photos for users cannot be modified after the creation of the event.

No link with all photos:
- There is no direct link provided for accessing all event photos.

No video capture:
- Users cannot capture videos within the app.

No photo filters:
- The app does not support applying filters to photos.

No live filters:
- Live filters cannot be applied during photo capture.

No cover screen application:
- Cover screens cannot be applied to photos.

No location tracking:
- The app does not collect or display location information.

No user account requirement:
- Participants do not need to create an account to use the app.

No Instagram photo integration:
- Photos cannot be sourced directly from Instagram.

Internet connection requirement:
- The app requires an internet connection to function.

No event templates:
- There are no pre-defined event templates available.

No event history tracking:
- The app does not provide a history of past events.

Single admin role:
- Each event has a single admin; multiple admin roles are not supported.

No pre-scheduled events:
- Events cannot be scheduled in advance.

No event choice options:
- Users cannot choose specific events to participate in.

No simultaneous multiple events:
- Users cannot create or participate in multiple events simultaneously.

No live streaming functionality:
- Live streaming of events is not supported.

No virtual reality integration:
- The app does not integrate with virtual reality technology.

No reward or badge system:
- There are no rewards or badges awarded to users.

No guest book feature:
- The app does not include a guest book feature for event interactions.

No insights or analytics:
- Insights or analytics on participant contributions and interactions with event photos are not available.

<br>

# Project Organisation

# Project Plan

# Functional Requirements 

## Features Overview

1. **Download the app:**
   - Allow users to download the app from their respective app stores.

2. **Account creation:**
   - Admin users can create accounts within the app.
   
3. **User registration:**
   - Collect user information such as name, email, and password for account registration.

4. **Password recreation:**
   - Provide functionality for users to recreate their password.

5. **Forgot password:**
   - Offer users the option to reset their password if forgotten.

6. **Event creation:**
   - Admin users can create new events within the app.
   
7. **Event parameter definition:**
   - Define event parameters such as duration, maximum photo limits, and other settings.

8. **QR code generation:**
   - Admin users can generate unique QR codes for each event.
   
9. **QR code sharing:**
   - Admin users can share the QR code via various channels (e.g., email, messaging) to invite participants.

10. **General gallery access:**
    - Users can access the general gallery to view shared photos.

11. **General gallery deletion:**
    - Users can delete photos from the general gallery.

12. **General gallery saving:**
    - Users can save photos from the general gallery to their devices.

13. **Personal gallery access:**
    - Users can access their gallery to view their own shared photos.

14. **Personal gallery deletion:**
    - Users can delete photos from their gallery.

15. **Personal gallery saving:**
    - Users can save photos from their gallery to their devices.

16. **Photo capture:**
    - Users can capture photos using the app's camera interface.

17. **Photo sharing:**
    - Participants and admin users can share event photos within the app.

18. **Photo downloading:**
    - Users can download event photos shared by others.

19. **App access without download:**
    - Participants can access event features without downloading the app.
  
20. **Security measures:**
    - Implement robust security measures to ensure user data and interactions are secure.

21. **Internet connectivity requirement:**
    - Require an active internet connection for users to access app features.

22. **Real-time updates:**
    - Provide real-time updates and automatic refreshments for the latest event information.

23. **Customer support access:**
    - Offer access to customer support resources within the app.

24. **Permission prompting:**
    - Prompt users for permission before accessing sensitive device features or personal data.

25. **Push notifications:**
    - Send push notifications to provide updates on event activities and announcements.

26. **User data management:**
    - Enable users to access and manage their personal data stored within the app.

## Features Breakdown

### Ubiquitous Requirements

Ubiquitous functional requirements are always active. They are not invoked by an event or input, nor are they limited to a subset of the system’s operating states.

Template:   The shall .

Example:     The control system shall prevent engine over speed.

### State-driven Requirements

State-driven functional requirements are active throughout the time a defined state remains true. In Mavin’s EARS method, state-driven requirements are identified with the keyword WHILE.

Template:   WHILE the shall .

Example:     While the aircraft is in-flight and the engine is running, the control system shall maintain engine fuel flow above ?? lbs/sec.

### Event-driven Requirements

Event-driven functional requirements require a response only when an event is detected at the system boundary. In other words, they are triggered by a specific event. The EARS method identifies event-driven requirements with the keyword WHEN.

Template:   WHEN the shall .

Example:     When continuous ignition is commanded by the aircraft, the control system shall switch on continuous ignition.

### Unwanted Behaviour Requirements

Unwanted behaviour functional requirements cover all undesirable situations. Good systems engineering (SE) practice anticipates undesirable situations and imposes requirements to mitigate them.

Unwanted behaviour requirements are often imposed when the system must respond to a trigger under less than optimum conditions. The EARS method uses the keyword combination IF/THEN to identify requirements aimed at mitigating unwanted behaviour.

Template:   IF, THEN the shall.

Example:     If the computed airspeed is unavailable, then the control system shall use the modelled airspeed.

### Complex Requirements

Often, a specific set of one or more preconditions (states or optional features) must be present before the occurrence a specific event for that event to trigger a required system response. In such cases, the EARS templates may be combined, using a combination of the keywords.

Complex requirements can be composed for desired behaviour or for unwanted behaviour. The EARS method provides a template for each.

Template:   (Desired behaviour) Where, while , when the shall .

Template:   (Unwanted behaviour) Where, while , if then the shall .

Example:     While the aircraft is on the ground, when reverse thrust is commanded, the control system shall enable deployment of the thrust reverser.

## User Interface and Design

# Target Audience

weeding, event, party, vacation, 

## Personas

## User Cases

## User Journey

## Functional Analysis

# Non-Functional Requirements

## Costs 

## Reliability

## Operability

## Recovery

## Delivery

## Maintainability

## Security

# Glossary


disposable camera
qr code
cross-platform