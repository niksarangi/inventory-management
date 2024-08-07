// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCu54O9bP0iz8YS8VS734KS-yYQxLHYQA",
  authDomain: "inventory-management-a7bbe.firebaseapp.com",
  projectId: "inventory-management-a7bbe",
  storageBucket: "inventory-management-a7bbe.appspot.com",
  messagingSenderId: "668394202767",
  appId: "1:668394202767:web:80d4cb585bc4f78df4b2fa",
  measurementId: "G-ZMNG20KGE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
