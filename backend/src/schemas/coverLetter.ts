import { z } from "zod";

export const generateCoverLetterSchema = z.object({
  reportId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid report ID"),
  tone: z.enum(["professional", "friendly", "confident"]).optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
});

export type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;

export interface CoverLetterResult {
  content: string;
  preview: string;
}
