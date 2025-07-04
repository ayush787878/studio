'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, runTransaction, increment } from 'firebase/firestore';
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

/**
 * Deducts one token from a user's balance.
 * This function uses a transaction to ensure atomic updates.
 * @param userId The UID of the user.
 * @throws An error if the user has no tokens or if the update fails.
 */
export async function deductToken(userId: string): Promise<void> {
    if (!db) {
        throw new Error('Firebase is not configured.');
    }
    const userRef = doc(db, 'users', userId);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error("User document does not exist!");
            }
            const currentTokens = userDoc.data().tokens || 0;
            if (currentTokens < 1) {
                throw new Error("Insufficient tokens.");
            }
            transaction.update(userRef, { tokens: increment(-1) });
        });
    } catch (e) {
        console.error("Token deduction transaction failed: ", e);
        if (e instanceof Error) {
            throw e; // Re-throw the specific error to be caught by the UI
        }
        throw new Error("Failed to deduct token. Please try again.");
    }
}

/**
 * Fetches a user profile from Firestore.
 * @param userId The UID of the user.
 * @returns The user's profile, or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!db) {
        throw new Error('Firebase is not configured.');
    }
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    } else {
        return null;
    }
}
