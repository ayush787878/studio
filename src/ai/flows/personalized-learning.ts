'use server';

/**
 * @fileOverview Personalized learning flow for providing recommendations on skincare, makeup, and lifestyle adjustments.
 *
 * - personalizedLearning - A function that provides personalized recommendations based on aesthetic score and facial analysis.
 * - PersonalizedLearningInput - The input type for the personalizedLearning function.
 * - PersonalizedLearningOutput - The return type for the personalizedLearning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningInputSchema = z.object({
  aestheticScore: z.number().describe('The overall aesthetic score of the user.'),
  featureAnalysis: z.record(z.string(), z.string()).describe('Detailed analysis of facial features.'),
  userPreferences: z.string().optional().describe('Optional user preferences or specific concerns.'),
});
export type PersonalizedLearningInput = z.infer<typeof PersonalizedLearningInputSchema>;

const PersonalizedLearningOutputSchema = z.object({
  skincareRecommendations: z.array(z.string()).describe('Personalized skincare recommendations.'),
  makeupTechniques: z.array(z.string()).describe('Makeup techniques tailored to enhance features.'),
  lifestyleAdjustments: z.array(z.string()).describe('Lifestyle adjustments for improved appearance.'),
  additionalResources: z.array(z.string()).optional().describe('Links to external resources or articles.'),
});
export type PersonalizedLearningOutput = z.infer<typeof PersonalizedLearningOutputSchema>;

export async function personalizedLearning(input: PersonalizedLearningInput): Promise<PersonalizedLearningOutput> {
  return personalizedLearningFlow(input);
}

// A new, simpler schema for the prompt itself. It takes one pre-compiled string.
const FinalPromptInputSchema = z.object({
    fullPrompt: z.string(),
});

const prompt = ai.definePrompt({
  name: 'personalizedLearningPrompt',
  input: {schema: FinalPromptInputSchema},
  output: {schema: PersonalizedLearningOutputSchema},
  prompt: `{{{fullPrompt}}}`, // Safely inject the pre-built prompt string.
});

const personalizedLearningFlow = ai.defineFlow(
  {
    name: 'personalizedLearningFlow',
    inputSchema: PersonalizedLearningInputSchema,
    outputSchema: PersonalizedLearningOutputSchema,
  },
  async (input) => {
    // Manually construct the full prompt string in TypeScript. This is much safer than
    // using a complex Handlebars template with potentially unsafe user/AI-generated content.
    const featureAnalysisString = Object.entries(input.featureAnalysis)
      .map(([feature, analysis]) => `- ${feature}: ${analysis}`)
      .join('\n');

    let fullPrompt = `Based on the user's aesthetic score of ${input.aestheticScore} and the following facial feature analysis:\n${featureAnalysisString}\n`;

    if (input.userPreferences) {
      fullPrompt += `\nConsidering the user's preferences: ${input.userPreferences}\n`;
    }

    fullPrompt += `
Provide personalized recommendations and educational content on skincare, makeup, and lifestyle adjustments to help the user improve their looks.

Format the output as a JSON object with 'skincareRecommendations', 'makeupTechniques', and 'lifestyleAdjustments' keys, each containing an array of strings. Include an optional 'additionalResources' key with links to external resources as needed.`;

    // Call the prompt with the safely constructed string.
    const {output} = await prompt({ fullPrompt });
    return output!;
  }
);
