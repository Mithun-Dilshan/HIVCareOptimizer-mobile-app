// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Use the values from your Firebase JSON
const firebaseConfig = {
  apiKey: 'AIzaSyCKc26YD6qxZJJPFWqLoluBuAKLEyXYt-A',
  authDomain: 'water-bill-reading.firebaseapp.com',
  databaseURL: 'https://water-bill-reading-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'water-bill-reading',
  storageBucket: 'water-bill-reading.firebasestorage.app',
  messagingSenderId: '902692366971',      // From project_number
  appId: '1:902692366971:android:6c6ec89bf88738d890d0de', // From mobilesdk_app_id
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports for Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
