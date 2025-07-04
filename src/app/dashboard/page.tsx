"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateUserTokens, saveAnalysis } from '@/services/userService';
import { analyzeFace, type AnalyzeFaceOutput } from '@/ai/flows/feature-analysis';
import { UploadCloud, Sparkles, Loader2, RefreshCw, Target, Lock } from 'lucide-react';
import { Logo } from '@/components/logo';

const GuestHeader = () => (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-border/20">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Logo />
        <span className="sr-only">Facelyz</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/login" prefetch={false}>
          <Button variant="ghost">
            Login
          </Button>
        </Link>
        <Link href="/login" prefetch={false}>
            <Button>Get Started</Button>
        </Link>
      </nav>
    </header>
);
  
const GuestFooter = () => (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground">&copy; 2024 Facelyz. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Terms of Service
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Privacy
        </Link>
      </nav>
    </footer>
);

const LockedContent = ({ signIn }: { signIn: () => Promise<void> }) => (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg z-10 p-4 text-center">
          <Lock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold font-headline mb-2">Unlock Full Analysis</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">Sign in to see your detailed results, personalized plan, and save your progress.</p>
          <Button onClick={signIn} size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Sign In to Unlock
          </Button>
      </div>
      <div className="space-y-6 blur-sm select-none pointer-events-none">
          <Card className="bg-accent/50">
              <CardHeader>
                  <CardTitle className="font-headline">Overall Impression</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">A brief, encouraging summary of facial aesthetics will appear here.</p>
              </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold font-headline">Feature Analysis</AccordionTrigger>
                  <AccordionContent>A detailed breakdown will be shown here.</AccordionContent>
              </AccordionItem>
          </Accordion>
          <Card className="bg-accent/50">
              <CardHeader>
                  <CardTitle className="font-headline">Skincare Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">Personalized skincare suggestions will be available here.</p>
              </CardContent>
          </Card>
      </div>
    </div>
);

const DashboardContent = () => {
    const { userProfile, signInWithGoogle } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [aestheticGoal, setAestheticGoal] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalyzeFaceOutput | null>(null);
    const [isResultPendingSave, setIsResultPendingSave] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect to save analysis after a guest logs in
    useEffect(() => {
        if (userProfile && analysisResult && isResultPendingSave) {
          const saveOnLogin = async () => {
            if (userProfile.tokens < 1) {
              toast({
                title: "Unlock Failed",
                description: "You do not have enough tokens to unlock this analysis.",
                variant: "destructive",
              });
              setIsResultPendingSave(false);
              return;
            }
            
            toast({ title: "Unlocking results...", description: "Saving to your account and deducting 1 token." });
            try {
              await saveAnalysis(userProfile.uid, imagePreview!, analysisResult);
              const newTokens = userProfile.tokens - 1;
              await updateUserTokens(userProfile.uid, newTokens);
              
              toast({
                title: "Analysis Unlocked & Saved!",
                description: "Your full results are now available.",
              });
              router.refresh();
            } catch (error) {
              console.error("Failed to save analysis on login:", error);
              toast({ title: "Error", description: "Could not save the analysis.", variant: "destructive" });
            } finally {
              setIsResultPendingSave(false);
            }
          };
          saveOnLogin();
        }
    }, [userProfile, analysisResult, isResultPendingSave, imagePreview, router, toast]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setImageFile(file);
          setAnalysisResult(null);
          setIsResultPendingSave(false);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    };
  
    const handleAnalyzeClick = async () => {
        if (!imageFile) return;

        if (userProfile && userProfile.tokens < 1) {
            toast({ variant: "destructive", title: "Analysis Failed", description: "You don't have enough tokens." });
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);
        setIsResultPendingSave(false);

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
    
        reader.onerror = () => {
          setIsLoading(false);
          toast({ variant: "destructive", title: "File Error", description: "Could not read the image file." });
        };
    
        reader.onloadend = async () => {
            try {
                const base64data = reader.result as string;
                const result = await analyzeFace({ photoDataUri: base64data, aestheticGoal });
                setAnalysisResult(result);
        
                if (userProfile) { // Logged-in user flow
                    await saveAnalysis(userProfile.uid, base64data, result);
                    const newTokens = userProfile.tokens - 1;
                    await updateUserTokens(userProfile.uid, newTokens);
                    toast({ title: "Analysis Complete & Saved", description: "1 token has been deducted." });
                    router.refresh();
                } else { // Guest user flow
                    setIsResultPendingSave(true);
                    toast({ title: "Preview Generated!", description: "Log in to unlock your full detailed analysis." });
                }
            } catch (error) {
                console.error("Analysis failed:", error);
                toast({ variant: "destructive", title: "Analysis Failed", description: "Something went wrong. Please try again." });
            } finally {
                setIsLoading(false);
            }
        };
    };

    const handleReset = () => {
        setImageFile(null);
        setImagePreview(null);
        setAnalysisResult(null);
        setIsResultPendingSave(false);
        setAestheticGoal('');
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  
    const tokens = userProfile?.tokens ?? 0;
    const isGuest = !userProfile;
  
    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in-0 duration-500">
            {/* Left Column: Uploader */}
            <Card className="lg:sticky lg:top-24 h-fit">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                    <Sparkles /> AI Face Analysis
                    </CardTitle>
                    <CardDescription>
                    Upload a clear, front-facing photo to begin. Optionally, describe your goals.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4 text-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg"
                            className="hidden"
                        />
                        <div
                            onClick={() => !isLoading && fileInputRef.current?.click()}
                            className={`group aspect-square max-w-sm mx-auto border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center transition-colors ${!isLoading ? 'cursor-pointer hover:border-primary' : 'cursor-not-allowed'}`}
                        >
                            {imagePreview ? (
                            <Image src={imagePreview} alt="Selected face" width={400} height={400} className="rounded-lg object-cover aspect-square" />
                            ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <UploadCloud className="h-12 w-12" />
                                <p>Click to upload a photo</p>
                                <p className="text-xs">PNG or JPG</p>
                            </div>
                            )}
                        </div>
                    </div>
                     <div className="space-y-2 pt-4 max-w-sm mx-auto">
                        <Label htmlFor="aesthetic-goal" className="font-semibold">What is your aesthetic goal? (Optional)</Label>
                        <Textarea
                            id="aesthetic-goal"
                            placeholder="e.g., I'd like to have a more defined jawline and clearer skin."
                            value={aestheticGoal}
                            onChange={(e) => setAestheticGoal(e.target.value)}
                            className="resize-none"
                            disabled={isLoading}
                        />
                    </div>
                     <div className="flex flex-col items-center gap-2 pt-4">
                        <Button
                            onClick={handleAnalyzeClick}
                            disabled={!imageFile || isLoading || (!isGuest && tokens < 1)}
                            size="lg"
                            className="w-full max-w-sm"
                        >
                            {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing...</>) 
                            : isGuest ? ('Analyze Face (Free Preview)') 
                            : (`Analyze Face (1 Token)`)}
                        </Button>
                        {imagePreview && (
                            <Button onClick={handleReset} variant="outline" size="lg" className="w-full max-w-sm">
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Clear Photo
                            </Button>
                        )}
                        {!isGuest && (
                            <>
                                <p className="text-sm text-muted-foreground pt-2">
                                    You have {tokens} {tokens === 1 ? 'token' : 'tokens'} remaining.
                                </p>
                                {tokens < 1 && !isLoading && <p className="text-destructive text-sm">You have no tokens left.</p>}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
    
            {/* Right Column: Results */}
            <div className="space-y-6">
                {isLoading && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            <p className="text-lg font-semibold font-headline">Our AI is analyzing your photo...</p>
                            <p className="text-muted-foreground">This may take a moment. Please don't close this page.</p>
                        </CardContent>
                    </Card>
                )}
                
                {!isLoading && !analysisResult && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                            <Sparkles className="h-16 w-16 text-muted-foreground/30"/>
                            <p className="text-lg font-semibold text-muted-foreground font-headline">Your analysis results will appear here</p>
                        </CardContent>
                    </Card>
                )}
    
                {analysisResult && (
                    <div className="space-y-6 animate-in fade-in-0 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Aesthetic Score</CardTitle>
                                <CardDescription>An overall score based on facial harmony, balance, and skin clarity.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <p className="text-5xl font-bold text-primary font-headline">{analysisResult.aestheticScore}</p>
                                <div className="w-full">
                                    <Progress value={analysisResult.aestheticScore} className="h-3" />
                                    <p className="text-sm text-right text-muted-foreground mt-1">/ 100</p>
                                </div>
                            </CardContent>
                        </Card>
    
                        {isGuest ? <LockedContent signIn={signInWithGoogle} /> : (
                            <>
                                <Card className="bg-accent/50">
                                    <CardHeader><CardTitle className="font-headline">Overall Impression</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <p className="text-5xl font-bold text-primary font-headline">{analysisResult.overallImpression.rating}</p>
                                            <div className="w-full">
                                                <Progress value={analysisResult.overallImpression.rating} className="h-3" />
                                                <p className="text-sm text-right text-muted-foreground mt-1">/ 100</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground pt-2">{analysisResult.overallImpression.text}</p>
                                    </CardContent>
                                </Card>
        
                                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                                    {analysisResult.featureAnalysis.map((feature, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className="text-lg font-semibold font-headline">{feature.feature}</AccordionTrigger>
                                            <AccordionContent className="text-base text-muted-foreground space-y-4 pt-4">
                                                <div className="flex items-center gap-4">
                                                    <p className="text-3xl font-bold text-primary font-headline">{feature.rating}</p>
                                                    <div className="w-full">
                                                        <Progress value={feature.rating} className="h-2" />
                                                        <p className="text-xs text-right text-muted-foreground mt-1">/ 100</p>
                                                    </div>
                                                </div>
                                                <p>{feature.analysis}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                
                                {analysisResult.personalizedPlan && analysisResult.personalizedPlan.length > 0 && (
                                    <Card className="border-primary/50 bg-primary/5">
                                        <CardHeader>
                                            <CardTitle className="font-headline flex items-center gap-2"><Target className="h-6 w-6 text-primary" />Your Personalized Plan</CardTitle>
                                            <CardDescription>A step-by-step guide based on your aesthetic goal.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {analysisResult.personalizedPlan.map((plan, index) => (
                                                <div key={index} className="p-4 bg-background rounded-md shadow-sm">
                                                    <h4 className="font-semibold text-primary">{`${index + 1}. ${plan.step}`}</h4>
                                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
        
                                <Card className="bg-accent/50">
                                    <CardHeader><CardTitle className="font-headline">Skincare Recommendations</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {analysisResult.skincareRecommendations.map((rec, index) => (
                                            <div key={index} className="p-4 bg-background rounded-md shadow-sm">
                                                <h4 className="font-semibold text-primary">{rec.recommendation}</h4>
                                                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { userProfile, loading } = useAuth();

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

    if (userProfile) {
        return <AppShell><DashboardContent /></AppShell>
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <GuestHeader />
            <main className="flex-1 pt-14">
                <div className="p-4 lg:p-6">
                    <DashboardContent />
                </div>
            </main>
            <GuestFooter />
        </div>
    );
}
