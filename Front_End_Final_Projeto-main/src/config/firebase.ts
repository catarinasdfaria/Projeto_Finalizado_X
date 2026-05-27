import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAesxUNg4GugousrspTUPI5Uz8pchXuRsc",
  authDomain: "projeto2526-c3321.firebaseapp.com",
  projectId: "projeto2526-c3321",
  storageBucket: "projeto2526-c3321.firebasestorage.app",
  messagingSenderId: "273295639924",
  appId: "1:273295639924:web:547ef943817add63801821",
  measurementId: "G-BZS6H4B7LW"
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
