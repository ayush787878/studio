
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateUserTokens, saveAnalysis, incrementAnalysisCount } from '@/services/userService';
import { analyzeFace, type AnalyzeFaceOutput } from '@/ai/flows/feature-analysis';
import { UploadCloud, Sparkles, RefreshCw, Target, Lock, Camera, VideoOff, Gift, PartyPopper } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { PublicHeader } from '@/components/public-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingIndicator } from '@/components/loading-indicator';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


const LockedContent = ({ signIn }: { signIn: () => Promise<void> }) => (
    <div className="relative mt-6">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80 p-4 text-center">
          <Lock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Unlock Full Analysis</h3>
           <p className="text-muted-foreground mb-4 max-w-sm">Sign in to see:</p>
           <ul className="text-left text-muted-foreground list-disc pl-6 mb-6 space-y-1">
                <li>Your detailed feature ratings</li>
                <li>A personalized improvement plan</li>
                <li>Your complete analysis history</li>
           </ul>
          <Button onClick={signIn} size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition-opacity shadow-lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Sign In to Unlock
          </Button>
      </div>
      <div className="space-y-6 blur-sm select-none pointer-events-none">
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Your Rating</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <RatingCard title="Overall" score={0} />
                 <RatingCard title="Potential" score={0} />
                 <RatingCard title="Masculinity" score={0} />
              </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">Feature Analysis</AccordionTrigger>
                  <AccordionContent>A detailed breakdown will be shown here.</AccordionContent>
              </AccordionItem>
          </Accordion>
      </div>
    </div>
);

const RatingCard = ({ title, score }: { title: string; score: number }) => {
    const getIndicatorColor = (value: number) => {
        if (value >= 75) return 'bg-green-500';
        if (value >= 50) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <Card className="text-center">
            <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-4xl font-bold text-foreground">{score}</p>
                <Progress value={score} className="h-2 mt-2" indicatorClassName={getIndicatorColor(score)} />
            </CardContent>
        </Card>
    );
};


const DashboardContent = () => {
    const { userProfile, signInWithGoogle, refreshUserProfile } = useAuth();
    const { toast } = useToast();

    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeFaceOutput | null>(null);
    const [isResultPendingSave, setIsResultPendingSave] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState('upload');
    const [showPromo, setShowPromo] = useState(false);
    const [showEventPromo, setShowEventPromo] = useState(false);
    const [showAnalysisConfetti, setShowAnalysisConfetti] = useState(false);
    const { width, height } = useWindowSize();


    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Effect for event promo pop-up
    useEffect(() => {
        if (userProfile) { // Only show to logged-in users
            const timer = setTimeout(() => {
                setShowEventPromo(true);
            }, 5000); // 5 seconds
            return () => clearTimeout(timer);
        }
    }, [userProfile]);

    // Effect to save analysis after a guest logs in
    useEffect(() => {
        if (userProfile && analysisResult && isResultPendingSave) {
          const saveOnLogin = async () => {
            if (userProfile.tokens < 3) {
              toast({
                title: "Unlock Failed",
                description: "You do not have enough tokens to unlock this analysis.",
                variant: "destructive",
              });
              setIsResultPendingSave(false);
              return;
            }
            
            toast({ title: "Unlocking results...", description: "Saving to your account and deducting 3 tokens." });
            try {
              await saveAnalysis(userProfile.uid, imageDataUri!, analysisResult);
              await incrementAnalysisCount(userProfile.uid);
              const newTokens = userProfile.tokens - 3;
              await updateUserTokens(userProfile.uid, newTokens);
              await refreshUserProfile();
              
              toast({
                title: "Analysis Unlocked & Saved!",
                description: "Your full results are now available.",
              });

              // Check for promo after saving for the first time
              const newAnalysisCount = userProfile.analysisCount + 1;
              if (newAnalysisCount === 1 || newAnalysisCount === 3) {
                setShowPromo(true);
              }

            } catch (error) {
              console.error("Failed to save analysis on login:", error);
              toast({ title: "Error", description: "Could not save the analysis.", variant: "destructive" });
            } finally {
              setIsResultPendingSave(false);
            }
          };
          saveOnLogin();
        }
    }, [userProfile, analysisResult, isResultPendingSave, imageDataUri, toast, refreshUserProfile]);
    
    useEffect(() => {
        if (showAnalysisConfetti) {
            const timer = setTimeout(() => setShowAnalysisConfetti(false), 8000); // Confetti for 8 seconds
            return () => clearTimeout(timer);
        }
    }, [showAnalysisConfetti]);
    
    useEffect(() => {
        const getCameraPermission = async () => {
          if (activeTab !== 'camera') return;
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings.',
            });
          }
        };
        getCameraPermission();
    
        return () => {
          // Cleanup: stop video stream when component unmounts or tab changes
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
        };
    }, [activeTab, toast]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setAnalysisResult(null);
          setIsResultPendingSave(false);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageDataUri(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    };

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            setImageDataUri(dataUri);
            setAnalysisResult(null);
            setIsResultPendingSave(false);
        }
    };
  
    const handleAnalyzeClick = async () => {
        if (!imageDataUri) return;

        if (userProfile && userProfile.tokens < 3) {
            toast({ variant: "destructive", title: "Analysis Failed", description: "You don't have enough tokens. Each analysis costs 3 tokens." });
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);
        setIsResultPendingSave(false);

        try {
            const aestheticGoal = userProfile?.aestheticGoal || '';
            const result = await analyzeFace({ photoDataUri: imageDataUri, aestheticGoal });
            setAnalysisResult(result);
            setShowAnalysisConfetti(true);
    
            if (userProfile) { // Logged-in user flow
                await saveAnalysis(userProfile.uid, imageDataUri, result);
                await incrementAnalysisCount(userProfile.uid);
                const newTokens = userProfile.tokens - 3;
                await updateUserTokens(userProfile.uid, newTokens);
                
                await refreshUserProfile(); // This will give us the new analysisCount
                
                toast({ title: "Analysis Complete & Saved", description: "3 tokens have been deducted." });
                
                // Use the fresh profile data to check for promo
                const newAnalysisCount = (userProfile.analysisCount || 0) + 1;
                if (newAnalysisCount === 1 || newAnalysisCount === 3) {
                    setShowPromo(true);
                }

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

    const handleReset = () => {
        setImageDataUri(null);
        setAnalysisResult(null);
        setIsResultPendingSave(false);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        // Re-request camera if in camera tab and permission was given
        if (activeTab === 'camera' && hasCameraPermission) {
            const getCameraPermission = async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                console.error('Error re-accessing camera:', error);
              }
            };
            getCameraPermission();
        }
    }
  
    const tokens = userProfile?.tokens ?? 0;
    const isGuest = !userProfile;
  
    return (
        <div className="animate-in fade-in-0 duration-500 space-y-8">
            {showAnalysisConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}
            <AlertDialog open={showPromo} onOpenChange={setShowPromo}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Gift className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-center text-2xl">A Special Offer For You!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center pt-2">
                           Get our complete **Health Care Full Book Advisor** for a comprehensive guide to self-improvement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center justify-center gap-4 my-4">
                        <span className="text-4xl font-bold text-primary">$23</span>
                        <Badge variant="destructive" className="text-lg py-1 px-3">95% OFF</Badge>
                    </div>
                    <AlertDialogFooter className="sm:justify-center gap-2">
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Link href="https://facelyze.com" target="_blank" rel="noopener noreferrer">
                                Claim Offer
                            </Link>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showEventPromo} onOpenChange={setShowEventPromo}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white rounded-full flex items-center justify-center">
                                <PartyPopper className="h-8 w-8" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-center text-2xl">Make Money With Your Reels!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center pt-2">
                           Join our Instagram Reels Event and win cash prizes by showcasing Facelyze. It's easy to participate!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2">
                        <AlertDialogCancel>Maybe Later</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Link href="/event">
                                Learn More
                            </Link>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


             {userProfile && !userProfile.aestheticGoal && (
                <Alert>
                    <Target className="h-4 w-4" />
                    <AlertTitle>Set Your Aesthetic Goal!</AlertTitle>
                    <AlertDescription>
                        You haven't set a goal yet. Visit the <Link href="/learning-plan" className="font-semibold text-primary hover:underline">Learning Plan</Link> page to create a personalized plan and get more tailored analysis results.
                    </AlertDescription>
                </Alert>
            )}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Uploader */}
                <div className="space-y-8">
                    <Card className="lg:sticky lg:top-24 h-fit">
                        <CardHeader>
                            <CardTitle className="text-3xl flex items-center gap-2 font-headline">
                            <Sparkles /> AI Face Analysis
                            </CardTitle>
                            <CardDescription>
                            Choose your input method. Your saved aesthetic goal will be used automatically.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload" className="flex items-center gap-2">
                                <UploadCloud /> Upload Photo
                                </TabsTrigger>
                                <TabsTrigger value="camera" className="flex items-center gap-2">
                                <Camera /> Use Camera
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload">
                                <div className="space-y-4 text-center pt-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => !isLoading && fileInputRef.current?.click()}
                                        className={`group aspect-square max-w-xs mx-auto border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center transition-colors ${!isLoading ? 'cursor-pointer hover:border-primary' : 'cursor-not-allowed'}`}
                                    >
                                        {imageDataUri ? (
                                        <Image src={imageDataUri} alt="Selected face" width={400} height={400} className="rounded-lg object-cover aspect-square" />
                                        ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <UploadCloud className="h-12 w-12" />
                                            <p>Click to upload a photo</p>
                                            <p className="text-xs">PNG or JPG</p>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="camera">
                                <div className="space-y-4 text-center pt-4">
                                    <div className="aspect-square max-w-xs mx-auto border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center overflow-hidden">
                                    {imageDataUri ? (
                                        <Image src={imageDataUri} alt="Captured face" width={400} height={400} className="object-cover aspect-square" />
                                    ) : (
                                        <>
                                        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                                        {hasCameraPermission === false && (
                                            <div className="absolute flex flex-col items-center gap-2 text-muted-foreground p-4">
                                                <VideoOff className="h-12 w-12" />
                                                <p>Camera access denied</p>
                                            </div>
                                        )}
                                        </>
                                    )}
                                    </div>
                                    {!imageDataUri && (
                                        <Button onClick={handleTakePhoto} disabled={isLoading || hasCameraPermission !== true} className="flex items-center gap-2">
                                        <Camera /> Take Photo
                                        </Button>
                                    )}
                                </div>
                            </TabsContent>
                            </Tabs>

                            <canvas ref={canvasRef} className="hidden" />
                            
                            <div className="flex flex-col items-center gap-2 pt-4">
                                <Button
                                    onClick={handleAnalyzeClick}
                                    disabled={!imageDataUri || isLoading || (!isGuest && tokens < 3)}
                                    size="lg"
                                    className="w-full max-w-xs"
                                >
                                    {isLoading ? "Analyzing..." : isGuest ? "Analyze Face (Free Preview)" : "Analyze Face (3 Tokens)"}
                                </Button>
                                {imageDataUri && (
                                    <Button onClick={handleReset} variant="outline" size="lg" className="w-full max-w-xs flex items-center gap-2">
                                        <RefreshCw />
                                        Clear Photo
                                    </Button>
                                )}
                                {!isGuest && (
                                    <>
                                        <p className="text-sm text-muted-foreground pt-2">
                                            You have {tokens} {tokens === 1 ? 'token' : 'tokens'} remaining.
                                        </p>
                                        {tokens < 3 && !isLoading && <p className="text-destructive text-sm">You don't have enough tokens left.</p>}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {analysisResult && !isGuest && (
                        <Card className="animate-in fade-in-0 duration-500 delay-100">
                            <CardHeader><CardTitle className="font-headline">Overall Impression</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <p className="text-5xl font-bold text-foreground">{analysisResult.overallImpression.rating}</p>
                                    <div className="w-full">
                                        <Progress value={analysisResult.overallImpression.rating} className="h-3" />
                                        <p className="text-sm text-right text-muted-foreground mt-1">/ 100</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground pt-2">{analysisResult.overallImpression.text}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
        
                {/* Right Column: Results */}
                <div className="space-y-6">
                    {isLoading && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                                <LoadingIndicator text="Our AI is analyzing your photo..." />
                                <Progress value={null} className="w-full h-2 animate-pulse" />
                                <p className="text-muted-foreground">This may take a moment. Please don't close this page.</p>
                            </CardContent>
                        </Card>
                    )}
                    
                    {!isLoading && !analysisResult && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                                <Sparkles className="h-16 w-16 text-muted-foreground/30"/>
                                <p className="text-lg font-semibold text-muted-foreground">Your analysis results will appear here</p>
                            </CardContent>
                        </Card>
                    )}
        
                    {analysisResult && (
                        <div className="space-y-6 animate-in fade-in-0 duration-500">
                            <Card className="animate-in fade-in-0 duration-500 bg-accent/50">
                                <CardHeader>
                                    <CardTitle className="font-headline">Aesthetic Score</CardTitle>
                                    <CardDescription>Overall harmony, balance, and skin clarity.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center gap-4">
                                    <p className="text-5xl font-bold text-primary">{analysisResult.aestheticScore}</p>
                                    <div className="w-full">
                                        <Progress value={analysisResult.aestheticScore} className="h-3" />
                                        <p className="text-sm text-right text-muted-foreground mt-1">/ 100</p>
                                    </div>
                                </CardContent>
                            </Card>
        
                            {isGuest ? <LockedContent signIn={signInWithGoogle} /> : (
                                <div className="space-y-6">
                                     <Card>
                                        <CardHeader>
                                            <CardTitle className="font-headline">Your Rating</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <RatingCard title="Overall" score={analysisResult.specificRatings.overall} />
                                            <RatingCard title="Potential" score={analysisResult.specificRatings.potential} />
                                            <RatingCard title="Masculinity" score={analysisResult.specificRatings.masculinity} />
                                            <RatingCard title="Jawline" score={analysisResult.specificRatings.jawline} />
                                            <RatingCard title="Cheekbones" score={analysisResult.specificRatings.cheekbones} />
                                            <RatingCard title="Skin Quality" score={analysisResult.specificRatings.skinQuality} />
                                        </CardContent>
                                    </Card>

                                    <Accordion type="single" collapsible className="w-full animate-in fade-in-0 duration-500 delay-200" defaultValue="item-0">
                                        {analysisResult.featureAnalysis.map((feature, index) => (
                                            <AccordionItem value={`item-${index}`} key={index}>
                                                <AccordionTrigger className="text-lg font-semibold">{feature.feature}</AccordionTrigger>
                                                <AccordionContent className="text-base text-muted-foreground space-y-4 pt-4">
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-3xl font-bold text-foreground">{feature.rating}</p>
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
                                        <Card className="border-primary/50 bg-primary/5 animate-in fade-in-0 duration-500 delay-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 font-headline"><Target className="h-6 w-6 text-primary" />Your Personalized Plan</CardTitle>
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
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {analysisResult && !isGuest && (
                <div className="animate-in fade-in-0 duration-500 delay-400">
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
                </div>
            )}
        </div>
    );
};

export default function HomePage() {
    const { userProfile, loading } = useAuth();

    if (loading) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <LoadingIndicator text="Loading Your Experience..." />
            </div>
          </div>
        );
    }

    if (userProfile) {
        return <AppShell><DashboardContent /></AppShell>
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PublicHeader />
            <main className="flex-1 pt-14">
                <div className="container py-8">
                    <DashboardContent />
                </div>
            </main>
            <Footer />
        </div>
    );
}
