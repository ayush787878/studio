"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateUserTokens } from '@/services/userService';
import { analyzeFace, type AnalyzeFaceOutput } from '@/ai/flows/feature-analysis';
import { UploadCloud, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFaceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setAnalysisResult(null); // Reset previous results when new image is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (!imageFile || !userProfile || userProfile.tokens < 1) {
      toast({
        title: "Analysis Failed",
        description: "Please select an image and ensure you have enough tokens.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onerror = () => {
      setIsLoading(false);
      toast({
        title: "File Error",
        description: "Could not read the image file. Please try a different one.",
        variant: "destructive",
      });
    };

    reader.onloadend = async () => {
      try {
        const base64data = reader.result as string;
        
        const result = await analyzeFace({ photoDataUri: base64data });
        setAnalysisResult(result);

        if (userProfile?.uid) {
            const newTokens = userProfile.tokens - 1;
            await updateUserTokens(userProfile.uid, newTokens);

            toast({
                title: "Analysis Complete",
                description: "Your results are ready. 1 token has been deducted.",
            });
            // A full page refresh is a simple way to update token count everywhere.
            router.refresh(); 
        }
      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          title: "Analysis Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const tokens = userProfile?.tokens ?? 0;

  return (
    <AppShell>
      <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in-0 duration-500">
        {/* Left Column: Uploader */}
        <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Sparkles /> AI Face Analysis
                </CardTitle>
                <CardDescription>
                Upload a clear, front-facing photo to begin.
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
                 <div className="flex flex-col items-center gap-2 pt-4">
                    <Button
                        onClick={handleAnalyzeClick}
                        disabled={!imageFile || isLoading || tokens < 1}
                        size="lg"
                        className="w-full max-w-sm"
                    >
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing...
                            </>
                        ) : (
                            `Analyze Face (1 Token)`
                        )}
                    </Button>
                    {imagePreview && (
                        <Button onClick={handleReset} variant="outline" size="lg" className="w-full max-w-sm">
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Clear Photo
                        </Button>
                    )}
                    <p className="text-sm text-muted-foreground pt-2">
                        You have {tokens} {tokens === 1 ? 'token' : 'tokens'} remaining.
                    </p>
                    {tokens < 1 && !isLoading && <p className="text-destructive text-sm">You have no tokens left.</p>}
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

                    <Card className="bg-accent/50">
                        <CardHeader>
                            <CardTitle className="font-headline">Overall Impression</CardTitle>
                        </CardHeader>
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

                    <Card className="bg-accent/50">
                        <CardHeader>
                            <CardTitle className="font-headline">Skincare Recommendations</CardTitle>
                        </CardHeader>
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
      </div>
    </AppShell>
  );
}
