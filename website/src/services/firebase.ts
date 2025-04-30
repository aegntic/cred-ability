// Firebase configuration for the CRED-<span style={{ fontSize: '1.1em' }}>a</span>BILITY project
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For actual deployment, these values should be in environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "cred-ability.firebaseapp.com",
  projectId: "cred-ability",
  storageBucket: "cred-ability.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
