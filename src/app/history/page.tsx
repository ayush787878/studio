"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { getAnalysisHistory, type AnalysisHistoryItem } from '@/services/userService';
import { Loader2, History, Frown } from 'lucide-react';

export default function HistoryPage() {
  const { userProfile } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.uid) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const historyData = await getAnalysisHistory(userProfile.uid);
          setHistory(historyData);
        } catch (error) {
          console.error("Failed to fetch analysis history:", error);
          // Optionally, show a toast message here
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    } else if (!userProfile) {
        // If there's no user but loading is finished, stop the spinner.
        setIsLoading(false);
    }
  }, [userProfile]);

  if (isLoading) {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg font-semibold font-headline">Loading your history...</p>
            </div>
        </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="flex items-center gap-4">
            <History className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Analysis History</h1>
                <p className="text-muted-foreground">Review your past analysis results.</p>
            </div>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
              <Frown className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg font-semibold text-muted-foreground font-headline">No History Found</p>
              <p className="text-muted-foreground">Perform an analysis on the dashboard to see your results here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">
                        Analysis from {new Date(item.timestamp).toLocaleString()}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Image src={item.photoDataUri} alt="Analysis photo" width={400} height={400} className="rounded-lg object-cover aspect-square w-full" />
                  </div>
                  <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Aesthetic Score</CardTitle>
                            <CardDescription>An overall score based on facial harmony, balance, and skin clarity.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <p className="text-5xl font-bold text-primary font-headline">{item.analysis.aestheticScore}</p>
                            <div className="w-full">
                                <Progress value={item.analysis.aestheticScore} className="h-3" />
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
                                <p className="text-5xl font-bold text-primary font-headline">{item.analysis.overallImpression.rating}</p>
                                <div className="w-full">
                                    <Progress value={item.analysis.overallImpression.rating} className="h-3" />
                                    <p className="text-sm text-right text-muted-foreground mt-1">/ 100</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground pt-2">{item.analysis.overallImpression.text}</p>
                        </CardContent>
                    </Card>

                    <Accordion type="single" collapsible className="w-full">
                        {item.analysis.featureAnalysis.map((feature, index) => (
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
                            {item.analysis.skincareRecommendations.map((rec, index) => (
                                <div key={index} className="p-4 bg-background rounded-md shadow-sm">
                                    <h4 className="font-semibold text-primary">{rec.recommendation}</h4>
                                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
