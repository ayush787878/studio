'use server';

/**
 * @fileOverview An AI agent that provides feedback on individual facial features based on beauty standards.
 *
 * - analyzeFacialFeatures - A function that handles the facial feature analysis process.
 * - AnalyzeFacialFeaturesInput - The input type for the analyzeFacialFeatures function.
 * - AnalyzeFacialFeaturesOutput - The return type for the analyzeFacialFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFacialFeaturesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFacialFeaturesInput = z.infer<typeof AnalyzeFacialFeaturesInputSchema>;

const AnalyzeFacialFeaturesOutputSchema = z.object({
  featureAnalysis: z.array(
    z.object({
      featureName: z.string().describe('The name of the facial feature.'),
      score: z
        .number()
        .min(0)
        .max(100)
        .describe('A score (0-100) indicating how well the feature aligns with beauty standards.'),
      feedback: z.string().describe('Detailed feedback on the facial feature.'),
    })
  ).describe('An array of feature analysis results.'),
});
export type AnalyzeFacialFeaturesOutput = z.infer<typeof AnalyzeFacialFeaturesOutputSchema>;

export async function analyzeFacialFeatures(input: AnalyzeFacialFeaturesInput): Promise<AnalyzeFacialFeaturesOutput> {
  return analyzeFacialFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFacialFeaturesPrompt',
  input: {schema: AnalyzeFacialFeaturesInputSchema},
  output: {schema: AnalyzeFacialFeaturesOutputSchema},
  prompt: `You are an AI aesthetician providing detailed feedback on facial features based on generally accepted beauty standards.

  Analyze the following facial features in the photo. Provide a score from 0-100 on each feature, and detailed feedback.

  Facial Features:
  - Forehead
  - Eyes
  - Nose
  - Cheeks
  - Jawline
  - Lips

  Here is the photo:
  {{media url=photoDataUri}}

  Ensure the output is formatted as a JSON array of objects, with 'featureName', 'score', and 'feedback' keys for each analyzed feature.
  `,
});

const analyzeFacialFeaturesFlow = ai.defineFlow(
  {
    name: 'analyzeFacialFeaturesFlow',
    inputSchema: AnalyzeFacialFeaturesInputSchema,
    outputSchema: AnalyzeFacialFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
