'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tokens: number;
};

const INITIAL_TOKENS = 10;

/**
 * Gets or creates a user profile in Firestore.
 * If the user is new, they are created with an initial token balance.
 * @param user The Firebase Auth user object.
 * @returns The user's profile from Firestore.
 */
export async function getOrCreateUser(user: User): Promise<UserProfile> {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      tokens: INITIAL_TOKENS,
    };
    await setDoc(userRef, newUserProfile);
    return newUserProfile;
  }
}
