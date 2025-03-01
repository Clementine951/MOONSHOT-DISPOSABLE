// Step 1: Configure Firebase
const firebaseConfig = {
    // Paste your config from "Project Settings" -> "General" -> "Your apps"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Step 2: Grab an eventId from the URL
  // e.g. user visits: https://yourdomain.xyz/?eventId=abc123
  // or /events/abc123 if you set up custom routing
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('eventId') || 'testEvent';
  
  // Step 3: Query Firestore for that event
  db.collection('events').doc(eventId).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      displayEvent(data);
    } else {
      document.getElementById('event-container').textContent = 'No event found!';
    }
  }).catch(err => {
    console.error(err);
  });
  
  // Step 4: Display the data
  function displayEvent(eventData) {
    const container = document.getElementById('event-container');
    container.innerHTML = `
      <h2>Event Name: ${eventData.eventName}</h2>
      <p>Organized by: ${eventData.userName}</p>
      <!-- You can add logic to fetch photos from Firestore/images subcollection here -->
    `;
  }
  