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

// Internal schema for the prompt, using a string for feature analysis
const PersonalizedLearningPromptInputSchema = PersonalizedLearningInputSchema.extend({
    featureAnalysis: z.string().describe('Detailed analysis of facial features as a formatted string.'),
});

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

const prompt = ai.definePrompt({
  name: 'personalizedLearningPrompt',
  input: {schema: PersonalizedLearningPromptInputSchema}, // Use the internal schema
  output: {schema: PersonalizedLearningOutputSchema},
  prompt: `Based on the user's aesthetic score of {{aestheticScore}} and the following facial feature analysis:
  {{featureAnalysis}}

  {{#if userPreferences}}Considering the user's preferences: {{userPreferences}}{{/if}}

  Provide personalized recommendations and educational content on skincare, makeup, and lifestyle adjustments to help the user improve their looks.

  Format the output as a JSON object with 'skincareRecommendations', 'makeupTechniques', and 'lifestyleAdjustments' keys, each containing an array of strings.  Include an optional 'additionalResources' key with links to external resources as needed.
  `,
});

const personalizedLearningFlow = ai.defineFlow(
  {
    name: 'personalizedLearningFlow',
    inputSchema: PersonalizedLearningInputSchema, // Flow uses the public schema
    outputSchema: PersonalizedLearningOutputSchema,
  },
  async (input) => {
    // Convert the feature analysis object into a simple string to avoid Handlebars issues.
    const featureAnalysisString = Object.entries(input.featureAnalysis)
      .map(([feature, analysis]) => `- ${feature}: ${analysis}`)
      .join('\n');

    const promptInput = {
      aestheticScore: input.aestheticScore,
      featureAnalysis: featureAnalysisString,
      userPreferences: input.userPreferences,
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
