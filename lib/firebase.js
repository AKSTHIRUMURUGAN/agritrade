// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCqSl-IQh9mH3mjJ5XV_T2va4DBzxjMNRY",
  authDomain: "in1-npk.firebaseapp.com",
  databaseURL: "https://in1-npk-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "in1-npk",
  storageBucket: "in1-npk.appspot.com",
  messagingSenderId: "261155760663",
  appId: "1:261155760663:web:ba2b313e6562b311764a52",
  measurementId: "G-NGGFBDH0SB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };