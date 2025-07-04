"use client";

import { useState, useTransition } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAdvisorySteps, type AdvisoryOutput } from '@/ai/flows/advisory';
import { Wand, Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdvisoryPage() {
  const [goal, setGoal] = useState('');
  const [isPending, startTransition] = useTransition();
  const [advisory, setAdvisory] = useState<AdvisoryOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!goal.trim()) {
      toast({ title: "Goal is empty", description: "Please describe how you'd like to change your look.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      setAdvisory(null);
      try {
        const result = await getAdvisorySteps({ goal });
        setAdvisory(result);
        toast({ title: "Your advisory plan is ready!" });
      } catch (error) {
        console.error("Advisory generation failed:", error);
        toast({ title: "Generation Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    });
  };

  const renderForm = () => (
    <div className="max-w-4xl mx-auto grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2"><Wand /> Your Beauty Goal</CardTitle>
          <CardDescription>Describe the look you want to achieve, and our AI will create a step-by-step plan for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'I want to get rid of dark circles and have a brighter complexion.' or 'How can I make my face look more symmetrical?'"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={6}
          />
           <div className="flex justify-end">
            <Button size="lg" onClick={handleGenerate} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isPending ? 'Generating...' : 'Generate My Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvisory = () => (
    <div className="max-w-4xl mx-auto space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Your Goal</CardTitle>
          <CardDescription className="italic">"{goal}"</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Step-by-Step Advisory</CardTitle>
          <CardDescription>Follow these AI-generated steps to achieve your desired look.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {advisory?.steps.map((step, index) => (
             <Card key={index} className="bg-accent/50">
                <CardHeader>
                   <CardTitle className="flex items-center gap-3">
                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">{index + 1}</span>
                       {step.title}
                   </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground ml-11 pl-1">{step.description}</p>
                </CardContent>
             </Card>
          ))}
        </CardContent>
      </Card>
       <div className="flex justify-start">
            <Button onClick={() => { setAdvisory(null); setGoal(''); }}>
              Start a New Goal
            </Button>
      </div>
    </div>
  );
  
  const renderLoadingState = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-64" />
        <Skeleton className="w-full h-64" />
    </div>
  );

  return (
    <AppShell>
      {isPending ? renderLoadingState() : (advisory ? renderAdvisory() : renderForm())}
    </AppShell>
  );
}
