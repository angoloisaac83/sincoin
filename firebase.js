// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqf3-KG4OaPq-dPvFvoX8yHFOkqsO8HRM",
  authDomain: "sincoin.firebaseapp.com",
  projectId: "sincoin",
  storageBucket: "sincoin.firebasestorage.app",
  messagingSenderId: "266905404565",
  appId: "1:266905404565:web:4733ee9fe0bd501312c79c",
  measurementId: "G-T35TCRB3ZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app,analytics}