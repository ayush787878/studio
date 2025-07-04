'use server';
/**
 * @fileOverview A facial feature analysis AI agent.
 *
 * - analyzeFace - A function that handles the face analysis process.
 * - AnalyzeFaceInput - The input type for the analyzeFace function.
 * - AnalyzeFaceOutput - The return type for the analyzeFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFaceInput = z.infer<typeof AnalyzeFaceInputSchema>;

const AnalyzeFaceOutputSchema = z.object({
    overallImpression: z.string().describe("Provide a brief, positive and encouraging overall impression of the user's facial aesthetics."),
    featureAnalysis: z.array(z.object({
        feature: z.string().describe("The facial feature being analyzed (e.g., Eyes, Nose, Lips, Jawline)."),
        analysis: z.string().describe("A detailed analysis of this specific feature."),
    })).describe("An array of analyses for key facial features."),
    skincareRecommendations: z.array(z.object({
        recommendation: z.string().describe("A specific skincare recommendation (e.g., 'Use a gentle cleanser')."),
        reason: z.string().describe("The reason for this recommendation based on the visual analysis of the photo."),
    })).describe("A list of personalized skincare recommendations."),
});
export type AnalyzeFaceOutput = z.infer<typeof AnalyzeFaceOutputSchema>;

export async function analyzeFace(input: AnalyzeFaceInput): Promise<AnalyzeFaceOutput> {
  return analyzeFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFacePrompt',
  input: {schema: AnalyzeFaceInputSchema},
  output: {schema: AnalyzeFaceOutputSchema},
  prompt: `You are an expert virtual aesthetician. Your goal is to provide a positive, constructive, and helpful analysis of a user's face based on a photograph. Be encouraging and focus on providing useful advice.

Analyze the provided photo. Identify key facial features, and provide personalized skincare recommendations.

Your analysis MUST be respectful, positive, and avoid any harsh or negative language. The tone should be that of a helpful professional providing expert advice.

Photo to analyze: {{media url=photoDataUri}}`,
});

const analyzeFaceFlow = ai.defineFlow(
  {
    name: 'analyzeFaceFlow',
    inputSchema: AnalyzeFaceInputSchema,
    outputSchema: AnalyzeFaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
