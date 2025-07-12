import { rtdb } from '@/lib/firebase';
import { ref, get, set, update, push, increment } from 'firebase/database';
import { type AnalyzeFaceOutput } from '@/ai/flows/feature-analysis';

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
  aestheticGoal?: string;
  analysisCount: number;
};

export interface AnalysisResult {
    timestamp: number;
    photoDataUri: string;
    analysis: AnalyzeFaceOutput;
}
  
export interface AnalysisHistoryItem extends AnalysisResult {
    id: string;
}

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
    // Ensure existing users have an analysisCount
    const profile = snapshot.val() as UserProfile;
    if (typeof profile.analysisCount === 'undefined') {
        profile.analysisCount = 0;
        await update(userRef, { analysisCount: 0 });
    }
    return profile;
  } else {
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      tokens: INITIAL_TOKENS,
      aestheticGoal: '',
      analysisCount: 0,
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

/**
 * Increments the analysis count for a user by 1.
 * @param uid The user's ID.
 */
export async function incrementAnalysisCount(uid: string): Promise<void> {
    if (!rtdb) {
        throw new Error('Firebase is not configured.');
    }
    const userRef = ref(rtdb, 'users/' + uid);
    await update(userRef, { analysisCount: increment(1) });
}

/**
 * Saves or updates the user's aesthetic goal.
 * @param uid The user's ID.
 * @param goal The aesthetic goal text.
 */
export async function saveUserGoal(uid: string, goal: string): Promise<void> {
  if (!rtdb) {
    throw new Error('Firebase is not configured.');
  }
  const userRef = ref(rtdb, 'users/' + uid);
  await update(userRef, { aestheticGoal: goal });
}

/**
 * Saves a new analysis result to the user's history.
 * @param uid The user's ID.
 * @param photoDataUri The data URI of the analyzed photo.
 * @param analysis The result from the AI analysis.
 */
export async function saveAnalysis(uid: string, photoDataUri: string, analysis: AnalyzeFaceOutput): Promise<void> {
    if (!rtdb) {
      throw new Error('Firebase is not configured.');
    }
    const historyRef = ref(rtdb, `users/${uid}/history`);
    const newAnalysisRef = push(historyRef); // `push` creates a unique ID
    await set(newAnalysisRef, {
      timestamp: Date.now(),
      photoDataUri,
      analysis,
    });
}
  
/**
 * Retrieves all analysis results for a given user.
 * @param uid The user's ID.
 * @returns A sorted array of analysis history items.
 */
export async function getAnalysisHistory(uid: string): Promise<AnalysisHistoryItem[]> {
    if (!rtdb) {
        throw new Error('Firebase is not configured.');
    }
    const historyRef = ref(rtdb, `users/${uid}/history`);
    const snapshot = await get(historyRef);

    if (snapshot.exists()) {
        const historyData = snapshot.val();
        // Convert the object of objects into an array of objects
        return Object.entries(historyData).map(([id, data]) => ({
            id,
            ...(data as AnalysisResult),
        })).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first
    }
    
    return [];
}
