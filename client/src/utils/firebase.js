
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "examnotes-78af0.firebaseapp.com",
  projectId: "examnotes-78af0",
  storageBucket: "examnotes-78af0.firebasestorage.app",
  messagingSenderId: "959491932948",
  appId: "1:959491932948:web:26c74fe5a290116f94b801"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}