'use server';
/**
 * @fileOverview An AI flow to generate advisory content on aesthetics and self-improvement.
 *
 * - getAdvisoryContent - A function that returns principles and book recommendations.
 * - AdvisoryContent - The return type for the getAdvisoryContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdvisoryContentSchema = z.object({
  principles: z.array(z.object({
    title: z.string().describe("The title of the principle or concept."),
    description: z.string().describe("A detailed explanation of the principle."),
  })).describe("A list of key principles for 'lookmaxxing' and facial aesthetics."),
  bookRecommendations: z.array(z.object({
    title: z.string().describe("The full title of the recommended book."),
    author: z.string().describe("The author of the book."),
    summary: z.string().describe("A brief summary of the book and why it's recommended."),
  })).describe("A list of 3-4 recommended books on the topics of aesthetics, self-improvement, or skincare."),
});

export type AdvisoryContent = z.infer<typeof AdvisoryContentSchema>;

export async function getAdvisoryContent(): Promise<AdvisoryContent> {
  return getAdvisoryContentFlow();
}

const prompt = ai.definePrompt({
  name: 'getAdvisoryContentPrompt',
  output: {schema: AdvisoryContentSchema},
  prompt: `You are a virtual aesthetics and self-improvement advisor. Your goal is to provide insightful, safe, and helpful information.

Generate a guide covering the core principles of "lookmaxxing" as it relates to facial aesthetics and overall well-being. This should be constructive advice focusing on health, skincare, and grooming. Avoid promoting unsafe practices.

Additionally, recommend 3-4 influential and well-regarded books that cover topics like skincare science, confidence, habit formation, or men's/women's grooming.

For the principles, provide a clear title and a detailed description for each.
For the book recommendations, provide the title, author, and a summary of why the book is valuable for someone interested in self-improvement.

Your response MUST conform to the specified JSON schema.`,
});

const getAdvisoryContentFlow = ai.defineFlow(
  {
    name: 'getAdvisoryContentFlow',
    outputSchema: AdvisoryContentSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
