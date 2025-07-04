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
    aestheticScore: z.number().min(0).max(100).describe("A numerical score from 0 to 100 representing the overall facial aesthetic harmony and balance."),
    overallImpression: z.object({
        text: z.string().describe("Provide a brief, positive and encouraging textual summary of the user's facial aesthetics."),
        rating: z.number().min(0).max(100).describe("A numerical rating from 0 to 100 for the overall impression. This score is based on the general positive qualities you observe."),
    }),
    featureAnalysis: z.array(z.object({
        feature: z.string().describe("The facial feature being analyzed (e.g., Eyes, Nose, Lips, Jawline)."),
        analysis: z.string().describe("A detailed analysis of this specific feature."),
        rating: z.number().min(0).max(100).describe("A numerical rating from 0 to 100 for this specific feature's harmony and balance."),
    })).describe("An array of analyses for key facial features, each with its own rating."),
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
- Provide an 'aestheticScore' from 0 to 100 based on overall facial harmony, balance, and clarity of the skin. Be objective and professional.
- For the 'overallImpression', provide both a textual summary in the 'text' field and a separate numerical 'rating' out of 100 that reflects the general positive impression.
- For each item in 'featureAnalysis', you must provide a numerical 'rating' from 0 to 100 for that specific feature, in addition to the textual analysis.

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
