import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCUlvUkMKqNIL9MwEfj87ULazhNEya7Swc",
  authDomain: "hit-or-miss-scorer.firebaseapp.com",
  projectId: "hit-or-miss-scorer",
  storageBucket: "hit-or-miss-scorer.appspot.com",
  messagingSenderId: "289683508915",
  appId: "1:289683508915:web:f388d11497200ba5162ac6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };