import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdQ0k11BJTg8OB8tfC1_1rNLo3oZDByjU",
  authDomain: "ghost-project-73927.firebaseapp.com",
  projectId: "ghost-project-73927",
  storageBucket: "ghost-project-73927.firebasestorage.app",
  messagingSenderId: "887982477228",
  appId: "1:887982477228:web:a6ee9f39412e39a8aff409",
  measurementId: "G-DZJGDBEK6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;