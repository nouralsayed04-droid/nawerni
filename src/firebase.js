import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAj_hl4x14zgUnPAacqboGBUc2DrYPRKss",
  authDomain: "nawerni-4b12e.firebaseapp.com",
  projectId: "nawerni-4b12e",
  storageBucket: "nawerni-4b12e.firebasestorage.app",
  messagingSenderId: "606841163716",
  appId: "1:606841163716:web:87079d92d792f902839e91",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);