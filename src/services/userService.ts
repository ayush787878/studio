import { rtdb } from '@/lib/firebase';
import { ref, get, set, update } from 'firebase/database';

// A simple interface for the properties we need from the Firebase Auth user.
export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

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
 * @param user The simplified AuthUser object.
 * @returns The user's profile from the Realtime Database.
 */
export async function getOrCreateUser(user: AuthUser): Promise<UserProfile> {
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

/**
 * Updates the token balance for a user.
 * @param uid The user's ID.
 * @param newTokens The new token balance.
 */
export async function updateUserTokens(uid: string, newTokens: number): Promise<void> {
    if (!rtdb) {
        throw new Error('Firebase is not configured.');
    }
    const userRef = ref(rtdb, 'users/' + uid);
    await update(userRef, { tokens: newTokens });
}
