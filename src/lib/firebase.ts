import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

// High Draw Golf - Firebase Configuration
// Environment variables loaded via Vite (VITE_ prefix required)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "high-draw-golf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "high-draw-golf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "high-draw-golf.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase App (Singleton Pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom OAuth parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in user using Google OAuth Popup
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Auth Error:", error.code, error.message);
    if (error.code === 'auth/unauthorized-domain') {
      alert("Auth Error: Domain not authorized in Firebase Console > Authentication > Settings > Authorized Domains.");
    }
    return null;
  }
};

/**
 * Sign out active user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
