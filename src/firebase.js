import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOrIM_s6vgX-OWQZJWIrgwxvnTU2HLV0g",
  authDomain: "clone-netflix-498f9.firebaseapp.com",
  projectId: "clone-netflix-498f9",
  storageBucket: "clone-netflix-498f9.firebasestorage.app",
  messagingSenderId: "544098043489",
  appId: "1:544098043489:web:6f8e591675a5e305b70c20",
  measurementId: "G-8Y1S5RH6RN"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();




export { auth };
export default db;