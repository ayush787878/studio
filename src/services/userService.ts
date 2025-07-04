'use server';

import { rtdb } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
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
 * Gets or creates a user profile in Firebase Realtime Database.
 * If the user is new, they are created with an initial token balance.
 * @param user The Firebase Auth user object.
 * @returns The user's profile from the Realtime Database.
 */
export async function getOrCreateUser(user: User): Promise<UserProfile> {
  if (!rtdb) {
    throw new Error('Firebase is not configured.');
  }
  const userRef = ref(rtdb, 'users/' + user.uid);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val() as UserProfile;
  } else {
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      tokens: INITIAL_TOKENS,
    };
    await set(userRef, newUserProfile);
    return newUserProfile;
  }
}
