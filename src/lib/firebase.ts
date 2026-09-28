import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import type { User, ConfirmationResult } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';

// High Draw Golf - Firebase Configuration for target project: high-draw-c00b9
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "high-draw-c00b9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "high-draw-c00b9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "high-draw-c00b9.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase App & Services
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// ==========================================
// 1. AUTHENTICATION SERVICES
// ==========================================

/**
 * Google OAuth Popup Sign-In
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    console.error("Google Auth Error:", error.code, error.message);
    if (error.code === 'auth/unauthorized-domain') {
      alert("Auth Error: Domain not authorized in Firebase Console.");
    }
    return null;
  }
};

/**
 * Email & Password Sign In
 */
export const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return res.user;
  } catch (error: any) {
    console.error("Email Login Error:", error.message);
    throw error;
  }
};

/**
 * Email & Password Sign Up
 */
export const registerWithEmail = async (email: string, pass: string, name?: string): Promise<User | null> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await syncUserProfile(res.user, name);
    }
    return res.user;
  } catch (error: any) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};

/**
 * Password Reset Email
 */
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Phone Auth Recaptcha Initializer
 */
export const initRecaptcha = (elementId: string): RecaptchaVerifier => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      console.log('Recaptcha verified for Phone Auth');
    }
  });
};

/**
 * Phone Auth SMS Code Request
 */
export const sendPhoneVerification = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

/**
 * Sign Out
 */
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// ==========================================
// 2. FIRESTORE DATABASE SERVICES
// ==========================================

/**
 * Sync user profile document to Firestore users collection
 */
export const syncUserProfile = async (user: User, customName?: string) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: customName || user.displayName || 'Golfer',
    photoURL: user.photoURL || null,
    lastLogin: serverTimestamp()
  }, { merge: true });
};

export interface FirestoreReview {
  id?: string;
  name: string;
  handicap: string;
  rating: number;
  comment: string;
  location: string;
  verified: boolean;
  date: string;
  userId?: string;
  createdAt?: any;
}

/**
 * Save customer review to Firestore database
 */
export const saveReviewToFirestore = async (review: Omit<FirestoreReview, 'id'>) => {
  const reviewsRef = collection(db, 'reviews');
  return await addDoc(reviewsRef, {
    ...review,
    createdAt: serverTimestamp()
  });
};

/**
 * Fetch reviews from Firestore database
 */
export const fetchReviewsFromFirestore = async (): Promise<FirestoreReview[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreReview[];
  } catch (error) {
    console.warn("Firestore reviews fetch fallback:", error);
    return [];
  }
};
