// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBriUNCBr0vOLDooOyiQouKoJR9f6N0dVc",
  authDomain: "schedule-369104.firebaseapp.com",
  projectId: "schedule-369104",
  storageBucket: "schedule-369104.appspot.com",
  messagingSenderId: "1040584853647",
  appId: "1:1040584853647:web:71cb04556b50475301c8fa",
  measurementId: "G-W8ZD23CMKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);