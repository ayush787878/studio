'use server';

/**
 * @fileOverview An AI agent that provides an overall aesthetic score for a given photo.
 *
 * - getAestheticScore - A function that handles the aesthetic scoring process.
 * - AestheticScoreInput - The input type for the getAestheticScore function.
 * - AestheticScoreOutput - The return type for the getAestheticScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AestheticScoreInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AestheticScoreInput = z.infer<typeof AestheticScoreInputSchema>;

const AestheticScoreOutputSchema = z.object({
  aestheticScore: z
    .number()
    .describe(
      'An overall aesthetic score for the photo, on a scale of 1 to 10, where 1 is the least aesthetic and 10 is the most aesthetic.'
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation of why the photo received the aesthetic score.'
    ),
});
export type AestheticScoreOutput = z.infer<typeof AestheticScoreOutputSchema>;

export async function getAestheticScore(
  input: AestheticScoreInput
): Promise<AestheticScoreOutput> {
  return aestheticScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aestheticScorePrompt',
  input: {schema: AestheticScoreInputSchema},
  output: {schema: AestheticScoreOutputSchema},
  prompt: `You are an AI aesthetician that scores the aesthetic appeal of photos.

You will use this information to assign an aesthetic score, on a scale of 1 to 10, where 1 is the least aesthetic and 10 is the most aesthetic. You will also explain why the photo received the score.

Photo: {{media url=photoDataUri}}`,
});

const aestheticScoreFlow = ai.defineFlow(
  {
    name: 'aestheticScoreFlow',
    inputSchema: AestheticScoreInputSchema,
    outputSchema: AestheticScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
