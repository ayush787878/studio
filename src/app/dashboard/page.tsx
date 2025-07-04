"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateUserTokens } from '@/services/userService';
import { analyzeFace, type AnalyzeFaceOutput } from '@/ai/flows/feature-analysis';
import { Coins, User, UploadCloud, Sparkles, Loader2, RefreshCw } from 'lucide-react';

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
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

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const result = await analyzeFace({ photoDataUri: base64data });
        setAnalysisResult(result);

        const newTokens = userProfile.tokens - 1;
        await updateUserTokens(userProfile.uid, newTokens);

        toast({
          title: "Analysis Complete",
          description: "Your results are ready below. 1 token has been deducted.",
        });
        router.refresh(); 
      };
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
      <div className="max-w-4xl mx-auto grid gap-8 animate-in fade-in-0 duration-500">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <User /> Welcome, {userProfile?.displayName || 'User'}!
            </CardTitle>
            <CardDescription>
              This is your main hub. All your information is shown here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-3">
                  <Coins className="text-primary" />
                  Your Token Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{tokens}</p>
                <p className="text-sm text-muted-foreground">
                  New users start with 10 tokens. Each analysis costs 1 token.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <Sparkles /> AI Face Analysis
            </CardTitle>
            <CardDescription>Upload a clear, front-facing photo to get your personalized analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!analysisResult && !isLoading && (
              <div className="space-y-4 text-center">
                 <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group aspect-square max-w-sm mx-auto border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
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
                <Button
                    onClick={handleAnalyzeClick}
                    disabled={!imageFile || isLoading || tokens < 1}
                    size="lg"
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
                {tokens < 1 && <p className="text-destructive text-sm mt-2">You have no tokens left.</p>}
              </div>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p className="text-lg font-semibold">Our AI is analyzing your photo...</p>
                    <p className="text-muted-foreground">This may take a moment. Please don't close this page.</p>
                </div>
            )}
            
            {analysisResult && (
                <div className="space-y-6 animate-in fade-in-0 duration-500">
                    <Card className="bg-background/50">
                        <CardHeader>
                            <CardTitle>Overall Impression</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{analysisResult.overallImpression}</p>
                        </CardContent>
                    </Card>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {analysisResult.featureAnalysis.map((feature, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg font-semibold">{feature.feature}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {feature.analysis}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <Card className="bg-accent/20">
                        <CardHeader>
                            <CardTitle>Skincare Recommendations</CardTitle>
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
                    
                    <div className="text-center">
                        <Button onClick={handleReset} variant="outline" size="lg">
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Analyze Another Photo
                        </Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
