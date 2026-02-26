import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBF0Kx4fgSDRlIkvsmN-0rvG_AK3WB-yPo",
  authDomain: "fes-netflix-clone.firebaseapp.com",
  projectId: "fes-netflix-clone",
  storageBucket: "fes-netflix-clone.firebasestorage.app",
  messagingSenderId: "778331653168",
  appId: "1:778331653168:web:d384d36b654d38930699f5",
  measurementId: "G-FVS2E37GTG"
};

// async function getCustomers() {
//   const customersCollection = collection(db, 'customers');
//   const customerSnapshot = await getDocs(customersCollection);
//   const customerList = customerSnapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data()
//   }));

//   console.log(customerList); // This will log the list of customers
// }

// // Call the function to fetch customers
// getCustomers();


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();



export { auth };
export default db;