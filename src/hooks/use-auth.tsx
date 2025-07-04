'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MissingFirebaseConfig = () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-destructive">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 text-destructive">
                <AlertTriangle className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">Firebase Configuration Missing</CardTitle>
            <CardDescription>
                Your app is not configured to connect to Firebase.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left text-sm">
            <p>To fix this, please add your Firebase project's configuration to your environment variables:</p>
            <div className="font-mono text-xs bg-muted p-4 rounded-md space-y-1">
                <p>NEXT_PUBLIC_FIREBASE_API_KEY=...</p>
                <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...</p>
                <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=...</p>
                <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...</p>
                <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...</p>
                <p>NEXT_PUBLIC_FIREBASE_APP_ID=...</p>
            </div>
            <p>You can find these values in your Firebase project settings under: <br /> <span className="font-semibold">Project Settings &gt; General &gt; Your apps &gt; Web app</span>.</p>
        </CardContent>
      </Card>
    </div>
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
        console.error("Firebase is not configured. Cannot sign in.");
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    if (!auth) {
        console.error("Firebase is not configured. Cannot sign out.");
        return;
    }
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error)
    {
      console.error("Error signing out", error);
    }
  };

  if (!auth) {
    return <MissingFirebaseConfig />;
  }

  // The loading check inside the AuthProvider will prevent children from rendering
  // before the auth state is resolved. This is a good place for a global loading screen.
  if (loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Logo />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
