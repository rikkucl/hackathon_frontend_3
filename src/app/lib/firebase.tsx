import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


export const firebaseConfig = {
  // apiKey: "AIzaSyB1rPPJ8k1WFuAMiU3Q56ssF5hgk1LaJ8s",
  // authDomain: "techhub-3886e.firebaseapp.com",
  // databaseURL: "https://techhub-3886e-default-rtdb.firebaseio.com",
  // projectId: "techhub-3886e",
  // storageBucket: "techhub-3886e.appspot.com",
  // messagingSenderId: "488062112320",
  // appId: "1:488062112320:web:9e17498bfc5835860d45a5",
  // measurementId: "G-K2V0NF1FQH",
  // apiKey: "AIzaSyBZmlXRjnsW8rCNlk1a9Q2mQSrPWCXmWkw",
  // authDomain: "term6-riku-yagashi.firebaseapp.com",
  // projectId: "term6-riku-yagashi",
  // storageBucket: "term6-riku-yagashi.appspot.com",
  // messagingSenderId: "1012715555694",
  // appId: "1:1012715555694:web:ee33a6a473454d68004f7f"

  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID
  apiKey: "AIzaSyBZmlXRjnsW8rCNlk1a9Q2mQSrPWCXmWkw",
  authDomain: "term6-riku-yagashi.firebaseapp.com",
  projectId: "term6-riku-yagashi",
  storageBucket: "term6-riku-yagashi.appspot.com",
  messagingSenderId: "1012715555694",
  appId: "1:1012715555694:web:ee33a6a473454d68004f7f"
};
const app = initializeApp(firebaseConfig);

const fireAuth = getAuth(app);
const db = getFirestore(app, "hackathon")
const storage = getStorage(app)
export {db, fireAuth, storage}