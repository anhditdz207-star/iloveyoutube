import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

// Default project configuration or user custom config from localStorage
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA_DEMO_KEY_ILOVEYOUTUBE_CUSTOM',
  authDomain: 'iloveyoutube-app.firebaseapp.com',
  projectId: 'iloveyoutube-app',
  storageBucket: 'iloveyoutube-app.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456',
};

function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem('iloveyoutube_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return DEFAULT_FIREBASE_CONFIG;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

try {
  const config = getFirebaseConfig();
  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase khởi tạo với cấu hình mặc định cục bộ:', e);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, signInWithPopup, firebaseSignOut, onAuthStateChanged };
export type { User };
