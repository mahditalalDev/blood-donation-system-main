// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8nOIlWxr5sazq5PS9Ryax3xcB8vfVSjQ",
    authDomain: "blood-donation-system-0.firebaseapp.com",
    projectId: "blood-donation-system-0",
    storageBucket: "blood-donation-system-0.appspot.com",
    messagingSenderId: "218504344556",
    appId: "1:218504344556:web:7d1e15ef0e0ed89bea46c9",
    measurementId: "G-YP5BN4CEN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Add Firebase app, auth, and db to the global scope
window.app = app;
window.analytics = analytics;
window.auth = auth;
window.db = db;