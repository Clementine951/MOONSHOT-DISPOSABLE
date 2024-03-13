# Functional specification

Questions
- authentification for the V2
- add if wrong QR code
- when clicked on the button validate for create -> a go back?
- Footer or header
- if start to create an event but leave or close -> no save 
- gallery -> start at personal
- settings -> auto save or button
- explain more the not downloadable thing
- can join after the end of an event?
- cross platform? 
- settings -> general and event at the same place?
- go back -> according to the stack or a dedicated place
- qr code generation not sure what to do 

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
    - [Ubiquitous Requirements](#ubiquitous-requirements)
    - [State-driven Requirements](#state-driven-requirements)
    - [Event-driven Requirements](#event-driven-requirements)
    - [Unwanted Behaviour Requirements](#unwanted-behaviour-requirements)
    - [Complex Requirements](#complex-requirements)
  - [User Interface and Design](#user-interface-and-design)
- [Target Audience](#target-audience)
  - [Personas](#personas)
  - [Use Cases](#use-cases)
    - [Use Case 1: Margaret's Baptism Photos](#use-case-1-margarets-baptism-photos)
    - [Use Case 2: Sarah's Christmas Celebration](#use-case-2-sarahs-christmas-celebration)
    - [Use Case 3: James's Wedding Engagement](#use-case-3-jamess-wedding-engagement)
    - [Use Case 4: Emily's Anniversary Party](#use-case-4-emilys-anniversary-party)
    - [Use Case 5: Alex's Party Planning](#use-case-5-alexs-party-planning)
  - [Functional Analysis](#functional-analysis)
- [Non-Functional Requirements](#non-functional-requirements)
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

// todo 
// talk about app clips and instant app
// participants don't need to download the app
// remove customisable camera settings
// automatically shared with the other participants
// promote engagement among attendees by reducing the time they will spent on their phone 
// due to a specific number of photos allowed 

## Report Issues

If you notice errors in this document, or would like to give feedback, please file a Doc Issue in the MOONSHOT-DISPOSABLE GitHub repository: https://github.com/Clementine951/MOONSHOT-DISPOSABLE/issues

# Project Definition

## Vision

The vision for the Disposable Camera application project is to develop a user-friendly mobile application that facilitates effortless capturing and sharing of memorable moments during events, with a particular focus on enhancing accessibility for older individuals. By prioritising simplicity, intuitiveness, and inclusivity, the app aims to bridge generational gaps and foster meaningful connections among attendees, ensuring that everyone can participate fully in capturing and reliving event experiences.

// todo
// to narrow the use of the phone 
// everyone can participate!
// keep the older people?
// without download

## Objectives

- Capture and share moments
- Nostalgic experience
- User-friendly interface
- Cross-platform compatibility
- Enhanced engagement

// 

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

1. **Duration of Event Uneditable**:
   - The duration of events cannot be edited once they are created.

2. **Non-customizable Number of Photos per User**:
   - The number of photos per user, decided by the admin, cannot be customized or edited after the creation of the event.

3. **Fixed Release of Photos**:
   - The release of photos for users cannot be modified after the creation of the event.

4. **No Link with All Photos**:
   - There is no direct link provided for accessing all event photos.

5. **No Video Capture**:
   - Users cannot capture videos within the app.

6. **No Photo Filters**:
   - The app does not support applying filters to photos.

7. **No Live Filters**:
   - Live filters cannot be applied during photo capture.

8. **No Cover Screen Application**:
   - Cover screens cannot be applied to photos.

9. **No Location Tracking**:
   - The app does not collect or display location information.

10. **No User Account Requirement**:
    - Participants do not need to create an account to use the app.

11. **No Instagram Photo Integration**:
    - Photos cannot be sourced directly from Instagram.

12. **Internet Connection Requirement**:
    - The app requires an internet connection to function.

13. **No Event Templates**:
    - There are no pre-defined event templates available.

14. **No Event History Tracking**:
    - The app does not provide a history of past events.

15. **Single Admin Role**:
    - Each event has a single admin; multiple admin roles are not supported.

16. **No Pre-scheduled Events**:
    - Events cannot be scheduled in advance.

17. **No Event Choice Options**:
    - Users cannot choose specific events to participate in.

18. **No Simultaneous Multiple Events**:
    - Users cannot create or participate in multiple events simultaneously.

19. **No Live Streaming Functionality**:
    - Live streaming of events is not supported.

20. **No Virtual Reality Integration**:
    - The app does not integrate with virtual reality technology.

21. **No Reward or Badge System**:
    - There are no rewards or badges awarded to users.

22. **No Guest Book Feature**:
    - The app does not include a guest book feature for event interactions.

23. **No Insights or Analytics**:
    - Insights or analytics on participant contributions and interactions with event photos are not available.

24. **No Deep Settings**:
    - Features such as blocking a user, changing the number of photos, changing release time, and accessibility options like font size, screen readers, and high contrast are not available.
    - Permissions management regarding who can access what features is not included.

<br>

# Project Organisation

## Stakeholders

| Stakeholders     | Role                                            |
|------------------|-------------------------------------------------|
| Clémentine CUREL | Lead and manage the project                     |
| ALGOSUP          | Provides academic guidance and requirements     |
| Reviewers        | Evaluate the project for grading                |

## Timeline

Project management, task allocation, and progress tracking are coordinated using [JIRA](https://virtual-processor.atlassian.net/jira/core/projects/MS/summary). For detailed information on tasks and deadlines, please refer to our JIRA board.

## Milestones 
// todo review

| Milestone      | Description                                              |
|----------------|----------------------------------------------------------|
| Functional     | Completion of functional requirements and feature set    |
| Technical      | Implementation of technical architecture and framework   |
| Roadmap        | Development plan for future iterations and enhancements  |
| V1             | Release of the first version of the application          |
| Jury 1         | Presentation and evaluation by the first jury panel      |
| User Testing   | Conducting user testing and gathering feedback           |
| V2             | Release of the second version of the application         |
| Jury 2         | Presentation and evaluation by the final jury panel      |

## Risks and Assumptions

### Risks 

|| Technical issues                                                                                                                                                        |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Potential technical challenges or bugs in the app development process may delay project progress or affect the functionality of the final product.                 |
| **Solution**    | Conduct thorough testing at each stage of development, employ experienced developers, and have contingency plans in place to address technical issues promptly. |

|| Scope creep                                                                                                                                                             |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | There's a risk of the project scope expanding beyond initial expectations, leading to increased workload and potential delays in project completion.                 |
| **Solution**    | Define clear project objectives and scope boundaries from the outset, regularly review and prioritise project requirements, and communicate any scope changes effectively. |

|| Resource constraints                                                                                                                                                   |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Limited availability of resources such as time, budget, or expertise may impact the project's ability to meet deadlines or deliver desired outcomes.                     |
| **Solution**    | Allocate resources efficiently, consider outsourcing non-critical tasks, and explore alternative solutions or technologies to mitigate resource limitations.          |

|| Compatibility issues                                                                                                                                                  |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Ensuring cross-platform compatibility may present challenges, particularly in integrating app features across different operating systems and devices.                     |
| **Solution**    | Use platform-agnostic development frameworks, conduct thorough compatibility testing, and collaborate closely with platform providers to address compatibility issues. |

|| User adoption                                                                                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | There's a risk that users may not fully adopt or engage with the app as intended, impacting its effectiveness and success in meeting project objectives.                 |
| **Solution**    | Prioritise user feedback, conduct usability testing, and implement user-friendly design principles to enhance user experience and encourage adoption of the app.        |

|| Data security breaches                                                                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Potential vulnerabilities in data security measures could lead to unauthorised access or breaches, compromising user data and damaging trust in the app.               |
| **Solution**    | Implement robust encryption protocols, adhere to industry best practices for data security, and regularly audit and update security measures to protect user data.   |

|| Regulatory compliance                                                                                                                                                  |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Failure to comply with relevant laws and regulations, such as data protection or privacy requirements, could result in legal issues or fines for the project.           |
| **Solution**    | Conduct thorough research on applicable regulations, seek legal guidance when necessary, and implement compliance measures throughout the development process.         |

|| External dependencies                                                                                                                                                 |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Reliance on external factors or third-party services may introduce risks related to their availability, reliability, or compatibility with the project.                   |
| **Solution**    | Identify and assess potential dependencies early, establish communication channels with third-party providers, and have contingency plans in place to mitigate dependency risks. |

|| Change in project requirements                                                                                                                                         |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Changes in project requirements or stakeholder expectations could disrupt project plans and require adjustments in resource allocation or development efforts.            |
| **Solution**    | Maintain open communication with stakeholders, document project requirements comprehensively, and regularly review and update project plans to accommodate changes as needed. |

|| Technology obsolescence                                                                                                                                               |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Rapid advancements in technology may render certain tools or frameworks obsolete during the project lifecycle, requiring adaptation or redevelopment efforts.            |
| **Solution**    | Stay informed about emerging technologies, plan for future scalability and adaptability, and incorporate modular design principles to facilitate technology updates as needed. |

|| Intellectual property infringement                                                                                                                                     |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | There's a risk of unintentional infringement of intellectual property rights, such as copyright or patent violations, which could result in legal consequences.         |
| **Solution**    | Conduct thorough research on existing patents and copyrights, obtain necessary permissions or licenses, and ensure that all development work complies with applicable intellectual property laws. |

|| Scalability and performance issues                                                                                                                                     |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Inadequate scalability or performance of the app under high user loads or increased data volume may lead to slowdowns, crashes, or degraded user experience.           |
| **Solution**    | Implement scalable architecture and performance optimisation techniques, conduct load testing and performance tuning, and regularly monitor system performance to address scalability and performance concerns proactively. |

|| Project management challenges                                                                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Challenges in project management, such as inadequate planning, lack of clarity in roles and responsibilities, or ineffective decision-making, could hinder progress.       |
| **Solution**    | Establish clear project objectives and timelines, define roles and responsibilities, and use project management tools and methodologies to streamline workflows and improve decision-making processes. |

|| Dependencies on key personnel                                                                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Reliance on specific individuals for critical tasks or expertise may pose risks if they become unavailable due to illness, departure, or other unforeseen circumstances. |
| **Solution**    | Cross-train team members, document critical processes and knowledge, and establish backup plans or contingencies to mitigate the impact of key personnel unavailability. |

|| Reputation damage                                                                                                                                                      |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Description** | Negative publicity, poor user reviews, or public perception issues related to the app's functionality, security, or ethical concerns could damage the project's reputation. |
| **Solution**    | Prioritise quality assurance and user experience, address user feedback and concerns promptly, and maintain transparent communication to build and preserve trust in the project. |

### Assumptions

| **Assumption**                                             | **Description**                                                                                               |
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Users' availability                                       | Users will have access to smartphones or mobile devices with compatible operating systems (iOS or Android).   |
| Internet connectivity                                    | Users will have access to a stable internet connection to download the app and share photos during events.    |
| User familiarity with mobile applications                   | Users will possess basic familiarity with mobile applications and digital photo-sharing platforms.             |
| Event participation                                      | Users will actively participate in events where the app is utilised, engaging in photo capture and sharing.  |
| User privacy and consent                                 | Users will provide consent for their photos to be shared within the app's galleries.                           |
| App performance and stability                           | The app will perform reliably on users' devices, with minimal crashes or technical issues.                    |
| Administrator engagement                                 | Administrators will actively manage events within the app, including event creation and gallery management.   |
| Event attendance and duration                            | Events facilitated through the app will have sufficient attendance and duration to justify its use.          |
| User feedback and iterative improvement                 | Users will provide feedback for iterative improvements and updates to enhance the user experience.           |
| Compliance with data protection regulations              | The app will comply with relevant data protection regulations and privacy laws.                               |

## Constraints

**Resource Constraints:**
- Limited budget allocated for the project, affecting procurement of software licences and hardware resources.
- Availability of skilled personnel for development and testing may be limited.
  
**Time Constraints:**
- Strict project deadlines imposed by the academic institution, requiring timely completion of deliverables.
  
**Legal and Regulatory Constraints:**
- Compliance with data protection regulations (e.g., GDPR) impacting data handling and storage practices.
- Intellectual property rights and licensing agreements affecting the use of third-party software or libraries.

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

// todo
### Ubiquitous Requirements

Ubiquitous functional requirements are always active. They are not invoked by an event or input, nor are they limited to a subset of the system’s operating states.

Template:   The shall .

Example:     The control system shall prevent engine over speed.

### State-driven Requirements

State-driven functional requirements are active throughout the time a defined state remains true. In Mavis EARS method, state-driven requirements are identified with the keyword WHILE.

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

To explore the mock-up of the Disposable Camera App on figma, you can click on this [figma link](https://www.figma.com/file/Y0JWQtRMokJs5hnwLF1sDu/Untitled?type=design&node-id=0%3A1&mode=design&t=ZZyTovJGYghNWaxW-1).

Graphic charter:

<img src="./Images/GraphCharter.png">

// todo each page

# Target Audience

## Personas

<img src="./Images/1.png">
<img src="./Images/2.png">
<img src="./Images/3.png">
<img src="./Images/4.png">
<img src="./Images/5.png">


## Use Cases


### Use Case 1: Margaret's Baptism Photos

**Actor**: Margaret

- **Description**: Margaret desires to receive photos of all participants at her grandson's baptism, as she lacks photography skills and financial resources to hire a professional. She aims to ensure comprehensive coverage of the event by obtaining photos taken by others.
- **Preconditions**: Margaret has access to a disposable camera.
- **Postconditions**: Margaret successfully collects photos from other participants, enhancing the coverage of her grandson's baptism.

- **Flow:** 
  - Margaret attends her grandson's baptism, equipped with the Disposable Camera app
  - Aware of her limitations in capturing photos, Margaret interacts with other attendees and encourages them to take photos with the app during the event
  - Throughout the ceremony, Margaret communicates her desire to receive copies of photos taken by other participants
  - As a result, Margaret receives a variety of photos taken by different individuals, enriching the coverage of her grandson's baptism and ensuring she has memories captured from various perspectives

### Use Case 2: Sarah's Christmas Celebration
- **Actor**: Sarah
- **Description**: Sarah aims to capture candid moments during her family's Christmas celebration using the Disposable Camera app.
- **Preconditions**: Sarah has shared the QR code of the Disposable Camera app with family members.
- **Postconditions**: Sarah collects digital photos taken during the celebration via the Disposable Camera app and will compiles them for a family album.
- **Flow**:
  1. Before the Christmas celebration, Sarah shares the QR code of the Disposable Camera app with family members, warning them that they don't have to download the app
  2. Throughout the event, family members use the Disposable Camera app to capture candid moments, such as opening presents, sharing meals, and playing games
  3. After the celebration, Sarah collects the digital photos taken by family members using the Disposable Camera app
  4. Sarah compiles the digital photos into a digital or printed family album, preserving the memories of the Christmas celebration captured through the app

### Use Case 3: James's Wedding Engagement
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

### Use Case 4: Emily's Anniversary Party
- **Actor**: Emily
- **Description**: Emily wants to capture fun moments during her anniversary party using the Disposable Camera app and share them on Instagram.
- **Preconditions**: Emily has created an event on the Disposable Camera app and shared the event QR code with party attendees. Emily has an Instagram account.
- **Postconditions**: Emily posts digital photos taken during the anniversary party via the Disposable Camera app on her Instagram profile.
- **Flow**:
  1. Before the anniversary party, Emily creates an event on the Disposable Camera app and shares the event QR code with party attendees.
  2. Guests attend the anniversary party and use their smartphones to scan the event QR code and access the Disposable Camera app without downloading it.
  3. Throughout the party, Emily and her friends use the Disposable Camera app to capture photos of themselves, their activities, and the decorations.
  4. After the party, Emily collects the digital photos taken by guests using the Disposable Camera app.
  5. Emily selects the best photos from the event and edits them if necessary(on an other app).
  6. Emily posts the edited photos on her Instagram profile, adding captions and hashtags to share the memories of her anniversary celebration with her followers.

### Use Case 5: Alex's Party Planning
- **Actor**: Alex
- **Description**: Alex wants to ensure a successful party by coordinating various aspects of planning and execution using the Disposable Camera app.
- **Preconditions**: Alex has access to resources for party planning and coordination.
- **Postconditions**: The party is executed smoothly, and attendees have an enjoyable experience.
- **Flow**:
  1. Alex begins by setting a date and theme for the party and creates an event on the Disposable Camera app.
  2. Alex shares the event QR code with invited guests, allowing them to access the Disposable Camera app without downloading it.
  3. Alex organises logistics such as decorations, food and drinks, and entertainment, updating the event details on the Disposable Camera app.
  4. On the day of the party, Alex uses the Disposable Camera app to capture photos of the setup, guests, and activities, contributing to the event's digital album.
  5. Throughout the party, Alex encourages guests to use the Disposable Camera app to capture their own photos and share them within the event album.
  6. After the party, Alex reviews the photos collected through the Disposable Camera app, sharing highlights with attendees and preserving memories of the event digitally.

## Functional Analysis

// todo resize images

**Legend:** 

<img src="./Images/Legend.png">

<br>

**Authentication:**

<img src="./Images/Authentication.png">

<br>

**Home screen:**

<img src="./Images/Home.png">

<br>

**Camera:**

<img src="./Images/Camera.png">

<br>

**Personal gallery:**

<img src="./Images/Personal.png">

<br>

**Personal settings:**

<img src="./Images/SettingsPerso.png">

<br>

**General gallery:**

<img src="./Images/General.png">

<br>

**Create event:**

<img src="./Images/Create.png">

<br>

**Event Settings:**

<img src="./Images/SettingsEvent.png">

<br>

# Non-Functional Requirements
// todo till the end
## Reliability

should not crash 

...

## Operability

cross platform ios android

## Recovery

in case of crash 

not closing the event 

not losing data and photos

## Delivery


As a free software with no commercial purpose, available to download from app store and play store

## Maintainability

Commented and documented code

## Security

GDPR

privacy

# Glossary

Academic Institution
Cross-Platform
Data Security
Disposable Camera
GDPR
Intellectual Property
Milestones
Non-Functional Requirements
Personal Data
Regulatory Compliance
Reviewers
Risks and Assumptions
Scope
Stakeholders
Timeline
User Interface