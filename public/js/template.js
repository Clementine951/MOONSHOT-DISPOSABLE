document.addEventListener("DOMContentLoaded", async () => {
    // Firebase configuration (ensure this is set up correctly in your project)
    const firebaseConfig = {
        apiKey: "AIzaSyD8KiOWHusg_tdH7BORIbbZDZN9Ej0dNSo",
        authDomain: "disposable-53b41.firebaseapp.com",
        projectId: "disposable-53b41",
        storageBucket: "disposable-53b41.appspot.com",
        messagingSenderId: "440372368924",
        appId: "1:440372368924:web:0d678b0f660cc09190f1d9"
    };
  
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();
  
    // Extract eventId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");
  
    if (!eventId) {
        document.body.innerHTML = "<h1>Event not found</h1>";
        return;
    }
  
    // Reference to Firestore document
    const eventRef = db.collection("events").doc(eventId);
  
    try {
        const eventDoc = await eventRef.get();
        if (!eventDoc.exists) {
            document.body.innerHTML = "<h1>Event does not exist</h1>";
            return;
        }
  
        const eventData = eventDoc.data();
        document.querySelector(".information h1").textContent = eventData.eventName;
        document.querySelector(".information p").textContent = `${eventData.userName} created this event.`;
  
        // Fetch Images
        const imagesRef = db.collection(`events/${eventId}/images`);
        const imageGrid = document.querySelector(".photoGrid");
        const snapshot = await imagesRef.get();
        const imageUrls = [];
  
        snapshot.forEach(doc => {
            const imageUrl = doc.data().url;
            imageUrls.push(imageUrl);
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "Event Image";
            imageGrid.appendChild(imgElement);
        });
  
        // Handle Download All Button
        document.querySelector(".first").addEventListener("click", async () => {
            const zip = new JSZip();
            const folder = zip.folder("event_photos");
            document.querySelector(".first").textContent = "Downloading...";
  
            await Promise.all(imageUrls.map(async (url, index) => {
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    folder.file(`photo_${index + 1}.jpg`, blob);
                } catch (error) {
                    console.error("Error downloading image:", error);
                }
            }));
  
            zip.generateAsync({ type: "blob" }).then(content => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(content);
                link.download = "event_photos.zip";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
  
                document.querySelector(".first").textContent = "Download all images";
            });
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        document.body.innerHTML = "<h1>Error loading event</h1>";
    }
  });
  