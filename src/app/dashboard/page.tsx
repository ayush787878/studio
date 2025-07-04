"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getAestheticScore, type AestheticScoreOutput } from '@/ai/flows/aesthetic-scoring';
import { analyzeFacialFeatures, type AnalyzeFacialFeaturesOutput } from '@/ai/flows/feature-analysis';
import { personalizedLearning, type PersonalizedLearningOutput } from '@/ai/flows/personalized-learning';
import { Upload, Bot, Sparkles, Droplets, SprayCan, Footprints, Share2, Star, Loader2, ChevronRight, CornerDownLeft } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const [aestheticScore, setAestheticScore] = useState<AestheticScoreOutput | null>(null);
  const [featureAnalysis, setFeatureAnalysis] = useState<AnalyzeFacialFeaturesOutput | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedLearningOutput | null>(null);
  
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageData(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!imageData) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        const [score, features] = await Promise.all([
          getAestheticScore({ photoDataUri: imageData }),
          analyzeFacialFeatures({ photoDataUri: imageData })
        ]);
        setAestheticScore(score);
        setFeatureAnalysis(features);

        const featureAnalysisMap = features.featureAnalysis.reduce((acc, feature) => {
          acc[feature.featureName] = `Score: ${feature.score}/100. Feedback: ${feature.feedback}`;
          return acc;
        }, {} as Record<string, string>);

        const personalPlan = await personalizedLearning({
          aestheticScore: score.aestheticScore,
          featureAnalysis: featureAnalysisMap,
          userPreferences: notes,
        });
        setRecommendations(personalPlan);

        toast({ title: "Analysis Complete", description: "Your Aura report is ready." });
      } catch (error) {
        console.error("Analysis failed:", error);
        toast({ title: "Analysis Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    });
  };

  const resetState = () => {
    setImagePreview(null);
    setImageData(null);
    setNotes('');
    setAestheticScore(null);
    setFeatureAnalysis(null);
    setRecommendations(null);
  };
  
  const renderAnalysisResults = () => (
    <Tabs defaultValue="report" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="report">
          <Bot className="w-4 h-4 mr-2" /> Analysis Report
        </TabsTrigger>
        <TabsTrigger value="plan">
          <Sparkles className="w-4 h-4 mr-2" /> Personalized Plan
        </TabsTrigger>
      </TabsList>
      <TabsContent value="report" className="animate-in fade-in-0 duration-500">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Analysis Report</CardTitle>
            <CardDescription>A detailed breakdown of your facial aesthetics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {imagePreview && <Image src={imagePreview} alt="Analyzed" width={400} height={400} className="rounded-lg object-cover aspect-square" />}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Star className="text-primary"/>Overall Aesthetic Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold text-primary font-headline">{aestheticScore?.aestheticScore.toFixed(0)}</span>
                      <span className="text-2xl text-muted-foreground">/ 100</span>
                    </div>
                    <Progress value={aestheticScore?.aestheticScore || 0} className="h-3" />
                    <p className="text-muted-foreground">{aestheticScore?.reason}</p>
                  </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Detailed Feature Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {featureAnalysis?.featureAnalysis.map(feature => (
                        <AccordionItem value={feature.featureName} key={feature.featureName}>
                            <AccordionTrigger className="font-headline text-lg">
                                <div className="flex justify-between items-center w-full pr-4">
                                    <span>{feature.featureName}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-primary">{feature.score}/100</span>
                                        <Progress value={feature.score} className="w-24 h-2" />
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {feature.feedback}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Personal Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground italic">{notes}</p>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={() => navigator.clipboard.writeText("My Aura analysis is ready! Check it out.")}><Share2 className="mr-2 h-4 w-4"/>Share</Button>
              <Button variant="outline" onClick={resetState}> <CornerDownLeft className="mr-2 h-4 w-4" /> Start New Analysis</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="plan" className="animate-in fade-in-0 duration-500">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Personalized Plan</CardTitle>
            <CardDescription>AI-generated recommendations to enhance your look.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RecommendationCard icon={<Droplets/>} title="Skincare Recommendations" items={recommendations?.skincareRecommendations} />
            <RecommendationCard icon={<SprayCan/>} title="Makeup Techniques" items={recommendations?.makeupTechniques} />
            <RecommendationCard icon={<Footprints/>} title="Lifestyle Adjustments" items={recommendations?.lifestyleAdjustments} />
             <div className="flex gap-4 pt-4">
              <Button onClick={() => navigator.clipboard.writeText("My Aura analysis is ready! Check it out.")}><Share2 className="mr-2 h-4 w-4"/>Share</Button>
              <Button variant="outline" onClick={resetState}> <CornerDownLeft className="mr-2 h-4 w-4" /> Start New Analysis</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const RecommendationCard = ({ icon, title, items }: { icon: React.ReactNode, title: string, items?: string[] }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">{icon}{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
                {items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
  )

  const renderUploadAndAnalyze = () => (
     <div className="max-w-4xl mx-auto grid gap-8 animate-in fade-in-0 duration-500">
        <Card>
            <CardHeader>
            <CardTitle className="text-2xl font-headline">Upload Your Photo</CardTitle>
            <CardDescription>Select a clear, well-lit photo for the most accurate analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Preview" width={256} height={256} className="object-cover h-full w-auto rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 4MB)</p>
                            </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    </label>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Personal Notes (Optional)</CardTitle>
                <CardDescription>Add any context or specific concerns you'd like the AI to consider.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="e.g., 'I'm concerned about my uneven skin tone' or 'Looking for makeup tips for my eye shape.'"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                />
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button size="lg" onClick={handleAnalyze} disabled={!imagePreview || isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isPending ? 'Analyzing...' : 'Generate Analysis'}
          </Button>
        </div>
      </div>
  );
  
  const renderLoadingState = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="w-full h-24" />
        <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-80 rounded-lg" />
            <Skeleton className="w-full h-80 rounded-lg" />
        </div>
        <Skeleton className="w-full h-64" />
    </div>
  );

  return (
    <AppShell>
      {isPending ? renderLoadingState() : (aestheticScore ? renderAnalysisResults() : renderUploadAndAnalyze())}
    </AppShell>
  );
}
