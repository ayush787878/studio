
'use server';
/**
 * @fileOverview An AI flow to identify a person in a photo.
 *
 * - identifyPerson - A function that handles the person identification process.
 * - IdentifyPersonInput - The input type for the identifyPerson function.
 * - IdentifyPersonOutput - The return type for the identifyPerson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPersonInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPersonInput = z.infer<typeof IdentifyPersonInputSchema>;

const IdentifyPersonOutputSchema = z.object({
    isPersonFound: z.boolean().describe("Whether or not a known person was identified in the photo."),
    name: z.string().describe("The full name of the identified person. If no one is found, this should be 'Unknown'."),
    details: z.string().describe("A brief, encyclopedia-style biography of the person. If no one is found, this should be an empty string."),
});
export type IdentifyPersonOutput = z.infer<typeof IdentifyPersonOutputSchema>;

export async function identifyPerson(input: IdentifyPersonInput): Promise<IdentifyPersonOutput> {
  return identifyPersonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPersonPrompt',
  input: {schema: IdentifyPersonInputSchema},
  output: {schema: IdentifyPersonOutputSchema},
  prompt: `You are an expert at identifying people in photographs.
Analyze the provided photo. Your task is to identify if the person in the photo is a known public figure (e.g., celebrity, politician, historical figure).

If you recognize the person:
- Set 'isPersonFound' to true.
- Provide their full 'name'.
- Write a brief, factual, encyclopedia-style summary of who they are in the 'details' field.

If you do not recognize the person or if there is no person in the image:
- Set 'isPersonFound' to false.
- Set 'name' to "Unknown".
- Set 'details' to an empty string.

Your response MUST be accurate and based only on the visual information in the photo.

Photo to analyze: {{media url=photoDataUri}}`,
});

const identifyPersonFlow = ai.defineFlow(
  {
    name: 'identifyPersonFlow',
    inputSchema: IdentifyPersonInputSchema,
    outputSchema: IdentifyPersonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
