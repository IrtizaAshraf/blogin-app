import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";

const firebaseConfig = {
      apiKey: "AIzaSyAv_BLlEJa1aF0GzZR_i46bOiYIEp93mXo",
      authDomain: "personal-blogger-app.firebaseapp.com",
      projectId: "personal-blogger-app",
      storageBucket: "personal-blogger-app.appspot.com",
      messagingSenderId: "908813242521",
      appId: "1:908813242521:web:8a63a70bba5c9a4b316808",
      measurementId: "G-SD02GX27B4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);