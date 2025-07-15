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
  aestheticGoal: z.string().optional().describe("An optional description of the user's desired aesthetic goal (e.g., 'a sharper jawline', 'brighter skin')."),
});
export type AnalyzeFaceInput = z.infer<typeof AnalyzeFaceInputSchema>;

const AnalyzeFaceOutputSchema = z.object({
    aestheticScore: z.number().min(0).max(100).describe("A numerical score from 0 to 100 representing the overall facial aesthetic harmony and balance."),
    overallImpression: z.object({
        text: z.string().describe("Provide a comprehensive, positive and encouraging textual summary of the user's facial aesthetics, covering multiple sentences. Mention the harmony, balance and proportionality of facial elements to create a positive and appealing aesthetic."),
        rating: z.number().min(0).max(100).describe("A numerical rating from 0 to 100 for the overall impression. This score is based on the general positive qualities you observe."),
    }),
    specificRatings: z.object({
        overall: z.number().min(0).max(100).describe("A rating for the overall facial harmony."),
        potential: z.number().min(0).max(100).describe("A rating for the user's aesthetic potential."),
        masculinity: z.number().min(0).max(100).describe("A rating for the masculinity of the facial features. If the face appears feminine, provide a lower score and note it in the analysis."),
        jawline: z.number().min(0).max(100).describe("A rating for the definition and shape of the jawline."),
        cheekbones: z.number().min(0).max(100).describe("A rating for the prominence and definition of the cheekbones."),
        skinQuality: z.number().min(0).max(100).describe("A rating for the quality and clarity of the skin, considering factors like texture and blemishes."),
    }).describe("A set of specific ratings for key aesthetic attributes."),
    featureAnalysis: z.array(z.object({
        feature: z.string().describe("The facial feature being analyzed (e.g., Eyes, Nose, Lips, Jawline)."),
        analysis: z.string().describe("A detailed analysis of this specific feature."),
        rating: z.number().min(0).max(100).describe("A numerical rating from 0 to 100 for this specific feature's harmony and balance."),
    })).describe("An array of analyses for key facial features, each with its own rating."),
    skincareRecommendations: z.array(z.object({
        recommendation: z.string().describe("A specific skincare recommendation (e.g., 'Incorporate a hydrating serum with hyaluronic acid')."),
        reason: z.string().describe("A detailed, multi-sentence explanation for this recommendation based on the visual analysis of the photo. Explain the potential benefits and what signs in the photo led to this suggestion."),
    })).describe("A list of detailed, personalized skincare recommendations. Each recommendation should be actionable and well-explained."),
    personalizedPlan: z.array(z.object({
        step: z.string().describe("A single, actionable step title (e.g., 'Facial Massage for Jawline Definition')."),
        description: z.string().describe("A detailed, multi-sentence explanation of how to perform this step and why it helps achieve the user's goal."),
    })).optional().describe("A step-by-step plan to achieve the user's aesthetic goal. This should only be generated if the user provides a goal."),
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
- For the 'overallImpression', provide both a detailed, multi-sentence textual summary in the 'text' field and a separate numerical 'rating' out of 100 that reflects the general positive impression.
- Provide the six 'specificRatings' (overall, potential, masculinity, jawline, cheekbones, skinQuality) as numerical scores from 0-100.
- For each item in 'featureAnalysis', you must provide a numerical 'rating' from 0 to 100 for that specific feature, in addition to the textual analysis.
- For 'skincareRecommendations', provide at least 3 detailed and actionable recommendations.
  - For each recommendation, the 'recommendation' field should be a clear, actionable title (e.g., "Use a Gentle Hydrating Cleanser").
  - The 'reason' field must be a comprehensive, multi-sentence explanation. It must connect the recommendation directly to specific observations from the user's photo (e.g., "Due to the observed mild redness and what appears to be some dry patches on your cheeks, a gentle hydrating cleanser is recommended..."). It should also suggest specific product types or key ingredients to look for (e.g., "Look for cleansers with ingredients like glycerin or hyaluronic acid, and avoid harsh sulfates.").

{{#if aestheticGoal}}
- The user has specified an aesthetic goal: "{{aestheticGoal}}". Based on your analysis of their photo, generate a 'personalizedPlan'. This plan must be a series of actionable, step-by-step instructions to help them work towards their goal. The steps should be safe, realistic, and constructive, potentially including skincare routines, facial exercises, or lifestyle suggestions. For each step, provide a clear 'step' title and a detailed 'description' explaining how to do it and why it helps.
{{/if}}

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
