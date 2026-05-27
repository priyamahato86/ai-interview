import { api } from "@/lib/api";

export interface CoverLetterResult {
  content: string;
  preview: string;
}

export const coverLetterApi = {
  generate: async (reportId: string, options?: { tone?: "professional" | "friendly" | "confident"; length?: "short" | "medium" | "long" }): Promise<CoverLetterResult> => {
    const response = await api.post<{ message: string; content: string; preview: string }>(
      "/cover-letter",
      {
        reportId,
        tone: options?.tone,
        length: options?.length,
      }
    );
    return {
      content: response.data.content,
      preview: response.data.preview,
    };
  },
};