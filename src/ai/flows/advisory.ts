'use server';

/**
 * @fileOverview An AI agent that provides step-by-step advisory on how to achieve a desired look.
 *
 * - getAdvisorySteps - A function that handles the advisory generation process.
 * - AdvisoryInput - The input type for the getAdvisorySteps function.
 * - AdvisoryOutput - The return type for the getAdvisorySteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdvisoryInputSchema = z.object({
  goal: z.string().describe("The user's goal for changing their look."),
});
export type AdvisoryInput = z.infer<typeof AdvisoryInputSchema>;

const AdvisoryOutputSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string().describe('The title of the advisory step.'),
      description: z.string().describe('A detailed description of the advisory step.'),
    })
  ).describe('An array of step-by-step advisory tips.'),
});
export type AdvisoryOutput = z.infer<typeof AdvisoryOutputSchema>;

export async function getAdvisorySteps(input: AdvisoryInput): Promise<AdvisoryOutput> {
  return advisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'advisoryPrompt',
  input: {schema: AdvisoryInputSchema},
  output: {schema: AdvisoryOutputSchema},
  prompt: `You are an expert beauty and wellness advisor. A user wants to achieve a specific look.

User's Goal: "{{goal}}"

Provide a detailed, step-by-step advisory plan to help the user achieve their goal. Break down the advice into actionable steps with a clear title and description for each. The advice can cover skincare, makeup, exercises, or lifestyle changes.
`,
});

const advisoryFlow = ai.defineFlow(
  {
    name: 'advisoryFlow',
    inputSchema: AdvisoryInputSchema,
    outputSchema: AdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
