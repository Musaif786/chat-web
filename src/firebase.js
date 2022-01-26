// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,

  // apiKey: "AIzaSyCAxOkq8U7ncv1wUkdZdt3eRyNxeCr9aWQ",
  // authDomain: "chatweb-6b4aa.firebaseapp.com",
  // databaseURL: "https://chatweb-6b4aa-default-rtdb.firebaseio.com",
  // projectId: "chatweb-6b4aa",
  // storageBucket: "chatweb-6b4aa.appspot.com",
  // messagingSenderId: "1005364537874",
  // appId: "1:1005364537874:web:9de1b5f12a859b83ff46cb"

  apiKey: "AIzaSyDWSEuWP28auYBRg5J_tUzGE8rRP83bTjg",
  authDomain: "chatweb-a9a7c.firebaseapp.com",
  databaseURL: "https://chatweb-a9a7c-default-rtdb.firebaseio.com",
  projectId: "chatweb-a9a7c",
  storageBucket: "chatweb-a9a7c.appspot.com",
  messagingSenderId: "851080075579",
  appId: "1:851080075579:web:43b3dfe8de239388d73f1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
