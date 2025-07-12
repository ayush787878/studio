'use server';
/**
 * @fileOverview An AI flow to generate a personalized learning plan based on a user's aesthetic goal.
 *
 * - generateLearningPlan - Creates a step-by-step plan for a user's goal.
 * - GenerateLearningPlanInput - The input type for the flow.
 * - GenerateLearningPlanOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLearningPlanInputSchema = z.object({
  aestheticGoal: z.string().describe("The user's desired aesthetic goal (e.g., 'a sharper jawline', 'brighter skin')."),
});
export type GenerateLearningPlanInput = z.infer<typeof GenerateLearningPlanInputSchema>;

const GenerateLearningPlanOutputSchema = z.object({
  plan: z.array(z.object({
      step: z.string().describe("A single, actionable step title (e.g., 'Facial Massage for Jawline Definition')."),
      description: z.string().describe("A detailed, multi-sentence explanation of how to perform this step and why it helps achieve the user's goal."),
      category: z.string().describe("The category of the step (e.g., 'Skincare', 'Exercise', 'Nutrition', 'Grooming')."),
  })).describe("A step-by-step plan to achieve the user's aesthetic goal."),
});
export type GenerateLearningPlanOutput = z.infer<typeof GenerateLearningPlanOutputSchema>;

export async function generateLearningPlan(input: GenerateLearningPlanInput): Promise<GenerateLearningPlanOutput> {
  return generateLearningPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningPlanPrompt',
  input: {schema: GenerateLearningPlanInputSchema},
  output: {schema: GenerateLearningPlanOutputSchema},
  prompt: `You are an expert virtual aesthetician and self-improvement coach.
Your task is to create a personalized, actionable, and safe step-by-step learning plan for a user based on their stated aesthetic goal.

The user's goal is: "{{aestheticGoal}}"

Generate a 'plan' consisting of several steps. For each step, provide:
- A clear, actionable 'step' title.
- A detailed 'description' explaining how to perform the step, its benefits, and any relevant tips.
- A 'category' for the step (e.g., 'Skincare', 'Exercise', 'Nutrition', 'Grooming', 'Lifestyle').

The plan should be constructive, encouraging, and focus on healthy, sustainable habits. Avoid promoting unsafe or extreme practices. Your response must be in the specified JSON format.`,
});

const generateLearningPlanFlow = ai.defineFlow(
  {
    name: 'generateLearningPlanFlow',
    inputSchema: GenerateLearningPlanInputSchema,
    outputSchema: GenerateLearningPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
