
"use client";

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { saveUserGoal } from '@/services/userService';
import { generateLearningPlan, type GenerateLearningPlanOutput } from '@/ai/flows/personalized-learning';
import { Sparkles, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { LoadingIndicator } from '@/components/loading-indicator';

const icons: { [key: string]: React.ReactNode } = {
  Skincare: <span className="text-lg">🧴</span>,
  Exercise: <span className="text-lg">🏃</span>,
  Nutrition: <span className="text-lg">🥗</span>,
  Grooming: <span className="text-lg">💈</span>,
  Lifestyle: <span className="text-lg">🧘</span>,
  Default: <span className="text-lg">💡</span>,
};

export default function LearningPlanPage() {
  const { userProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();

  const [aestheticGoal, setAestheticGoal] = useState(userProfile?.aestheticGoal || '');
  const [learningPlan, setLearningPlan] = useState<GenerateLearningPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    if (!aestheticGoal.trim()) {
      toast({
        title: "Goal Required",
        description: "Please describe your aesthetic goal first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setLearningPlan(null);

    try {
      // First, save the goal to the user's profile
      if (userProfile) {
        await saveUserGoal(userProfile.uid, aestheticGoal);
        await refreshUserProfile(); // Refresh context to have the latest goal
        toast({
          title: "Goal Saved!",
          description: "Your aesthetic goal has been updated in your profile.",
        });
      }


      // Then, generate the learning plan
      const result = await generateLearningPlan({ aestheticGoal });
      setLearningPlan(result);
    } catch (e) {
      console.error("Failed to generate learning plan:", e);
      setError("Failed to generate your plan. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <AppShell>
        <div className="space-y-8 animate-in fade-in-0 duration-500">
          <div className="flex items-center gap-4">
              <Lightbulb className="h-8 w-8 text-primary" />
              <div>
                  <h1 className="text-3xl font-bold">Personalized Learning Plan</h1>
                  <p className="text-muted-foreground">Define your goal to receive a tailored step-by-step plan.</p>
              </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Define Your Aesthetic Goal</CardTitle>
              <CardDescription>
                What would you like to achieve? Be specific for the best results. Your goal will be saved to your profile and used for future analyses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aesthetic-goal" className="font-semibold">My Goal Is...</Label>
                <Textarea
                    id="aesthetic-goal"
                    placeholder="e.g., I want to reduce acne and achieve a more symmetrical facial structure."
                    value={aestheticGoal}
                    onChange={(e) => setAestheticGoal(e.target.value)}
                    className="resize-none min-h-[100px]"
                    disabled={isLoading}
                />
              </div>
              <Button onClick={handleGeneratePlan} disabled={isLoading || !aestheticGoal.trim()} size="lg">
                {isLoading ? "Generating & Saving..." : <><Sparkles className="mr-2 h-5 w-5" />Generate My Plan</>}
              </Button>
            </CardContent>
          </Card>

          {isLoading && (
              <Card>
                  <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[300px]">
                      <LoadingIndicator />
                      <p className="text-lg font-semibold">Our AI is crafting your personalized plan...</p>
                      <p className="text-muted-foreground">This may take a moment.</p>
                  </CardContent>
              </Card>
          )}

          {error && (
               <Card>
                  <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[300px] text-destructive">
                      <AlertTriangle className="h-16 w-16" />
                      <p className="text-lg font-semibold">Error</p>
                      <p>{error}</p>
                  </CardContent>
              </Card>
          )}

          {learningPlan && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-primary" />
                      Your Personalized Plan
                  </CardTitle>
                  <CardDescription>A step-by-step guide based on your aesthetic goal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {learningPlan.plan.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-md shadow-sm">
                          <div className="p-2 bg-primary/10 rounded-full mt-1">
                            {icons[item.category] || icons.Default}
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">{`${index + 1}. ${item.step}`}</h4>
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider my-1">{item.category}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                      </div>
                  ))}
              </CardContent>
            </Card>
          )}

        </div>
      </AppShell>
  );
}
