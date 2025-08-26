import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// DOM Elements
const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');
const logoutBtn = document.getElementById('logoutBtn');
const adminTools = document.getElementById('adminTools');
const championList = document.getElementById('championList');

// Check Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const role = localStorage.getItem('userRole');
    userEmail.textContent = user.email;
    userRole.textContent = role;

    if (role === 'admin') {
      adminTools.style.display = 'block';
    }

    loadChampionData();
  } else {
    window.location.href = 'index.html'; // redirect to login
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = 'index.html';
  });
});

// Load Champion Data
async function loadChampionData() {
  try {
    const querySnapshot = await getDocs(collection(db, "champions"));
    championList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement('div');
      div.innerHTML = `<strong>${data.name}</strong> — ${data.department} — Score: ${data.score}`;
      championList.appendChild(div);
    });
  } catch (error) {
    championList.innerHTML = 'Error loading data.';
    console.error(error);
  }
}
