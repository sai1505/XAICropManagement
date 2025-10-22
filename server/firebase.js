// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1R80DreEUIRJ3q6PZwMuESXKUHnI4_Aw",
    authDomain: "cropguardai-10f51.firebaseapp.com",
    projectId: "cropguardai-10f51",
    storageBucket: "cropguardai-10f51.firebasestorage.app",
    messagingSenderId: "1071898488341",
    appId: "1:1071898488341:web:51d62ad0a4c7e9e5f8281c",
    measurementId: "G-DNR5BE99WX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);