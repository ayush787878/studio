'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateUser, type UserProfile, type AuthUser } from '@/services/userService';

interface AuthContextType {
  userProfile: UserProfile | null;
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
            <CardTitle className="text-2xl font-bold text-destructive font-headline">Firebase Configuration Missing</CardTitle>
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Immediately create a plain object to prevent passing the complex
          // Firebase User object with circular references down the chain.
          const authUser: AuthUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
          const profile = await getOrCreateUser(authUser);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error getting or creating user profile:", error);
          toast({
            title: "Account Error",
            description: "Couldn't retrieve your account details. Please try refreshing.",
            variant: "destructive",
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    if (!auth) {
        console.error("Firebase is not configured. Cannot sign in.");
        toast({
            title: "Firebase Not Configured",
            description: "The application is not connected to Firebase. Please check the setup.",
            variant: "destructive"
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle creating the user profile and routing.
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      let description = "An unknown error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            description = 'Sign-in popup closed by user. Please try again.';
            break;
          case 'auth/popup-blocked':
            description = 'Sign-in popup was blocked by the browser. Please allow popups for this site.';
            break;
          case 'auth/operation-not-allowed':
            description = 'Google Sign-in is not enabled in the Firebase console.';
            break;
          case 'auth/unauthorized-domain':
             description = 'This domain is not authorized for OAuth operations. Please check your Firebase console settings.';
             break;
          case 'auth/api-key-not-valid':
             description = 'The provided Firebase API key is not valid. Please check your configuration.';
             break;
          default:
            description = error.message;
            break;
        }
      }
      toast({
          title: "Login Failed",
          description,
          variant: "destructive"
      });
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
    } catch (error) {
      console.error("Error signing out", error);
       toast({
          title: "Logout Failed",
          description: "An error occurred while signing out. Please try again.",
          variant: "destructive"
      });
    }
  };

  if (!auth) {
    return <MissingFirebaseConfig />;
  }

  if (loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Logo />
            <p className="text-muted-foreground animate-pulse">Loading Your Experience...</p>
          </div>
        </div>
      );
  }

  return (
    <AuthContext.Provider value={{ userProfile, loading, signInWithGoogle, logout }}>
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
