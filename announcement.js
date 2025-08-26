import { db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const announcementForm = document.getElementById('announcementForm');
const announcementList = document.getElementById('announcementList');

// Submit Announcement (Admin Only)
announcementForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const message = e.target.message.value;

  try {
    await addDoc(collection(db, "announcements"), {
      title,
      message,
      timestamp: serverTimestamp()
    });
    e.target.reset();
  } catch (error) {
    console.error("Error posting announcement:", error);
  }
});

// Real-Time Display
const q = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  announcementList.innerHTML = '';
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<strong>${data.title}</strong><br>${data.message}<hr>`;
    announcementList.appendChild(div);
  });
});
