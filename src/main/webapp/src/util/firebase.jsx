import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBmWjsymiVZhETMyPXUdf-fQOFyscaizQ8",
  authDomain: "actuality-fullstack.firebaseapp.com",
  projectId: "actuality-fullstack",
  storageBucket: "actuality-fullstack.appspot.com",
  messagingSenderId: "288922276420",
  appId: "1:288922276420:web:4d92f36fb877d538f3a211",
  measurementId: "G-JM8RPYBBZV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
