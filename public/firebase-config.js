// Firebase Configuration
// PASTE YOUR KEYS HERE FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyDG4S6b3AtjcdoNG_WuxJgLxMkOF6pgHPQ",
    authDomain: "yassine-ccfbb.firebaseapp.com",
    projectId: "yassine-ccfbb",
    storageBucket: "yassine-ccfbb.firebasestorage.app",
    messagingSenderId: "109373853701",
    appId: "1:109373853701:web:d03461b3fc6dd2c181cc6c",
    measurementId: "G-5JMC62YFMW"
};

// Initialize Firebase
try {
    const app = firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();

    // Enable Offline Persistence
    window.db.enablePersistence()
        .catch((err) => {
            console.warn('Persistence Error:', err.code);
        });

    console.log('Firebase Initialized', window.db);
} catch (e) {
    console.error('Firebase Init Error', e);
    alert('System Error: Firebase Failed to Load. ' + e.message);
}
