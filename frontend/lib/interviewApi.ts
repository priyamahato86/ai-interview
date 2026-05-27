import { api } from "@/lib/api";
import { z } from "zod";
import {
  interviewReportSchema,
  interviewReportSummarySchema,
  type InterviewReport,
  type InterviewReportSummary,
} from "@/lib/schemas/interview";
import type { ResumeCustomization } from "@/types/resume";

export { type InterviewReport, type InterviewReportSummary };

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export const interviewApi = {
  getAllReports: async (params?: { search?: string; minScore?: number; maxScore?: number }): Promise<InterviewReportSummary[]> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.minScore !== undefined) searchParams.append("minScore", String(params.minScore));
    if (params?.maxScore !== undefined) searchParams.append("maxScore", String(params.maxScore));

    const queryString = searchParams.toString();
    const url = `/interview-reports${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<{ message: string; interviewReports: InterviewReportSummary[] }>(url);

    const result = z.array(interviewReportSummarySchema).safeParse(response.data.interviewReports);
    if (!result.success) {
      console.error("Report list validation failed:", result.error.issues);
      return response.data.interviewReports;
    }

    return result.data;
  },

  getReportById: async (id: string): Promise<InterviewReport> => {
    const response = await api.get<{ message: string; interviewReport: InterviewReport }>(
      `/interview-reports/${id}`
    );

    const result = interviewReportSchema.safeParse(response.data.interviewReport);
    if (!result.success) {
      console.error("Report detail validation failed:", result.error.issues);
      throw new Error("Invalid report data from server");
    }

    return result.data;
  },

  shareReport: async (id: string): Promise<{ shareUrl: string; shareToken: string }> => {
    const response = await api.post<{ message: string; shareUrl: string; shareToken: string }>(
      `/interview-reports/${id}/share`
    );
    return { shareUrl: response.data.shareUrl, shareToken: response.data.shareToken };
  },

  unshareReport: async (id: string): Promise<void> => {
    await api.delete(`/interview-reports/${id}/share`);
  },

  getSharedReport: async (token: string): Promise<InterviewReport> => {
    const response = await api.get<{ message: string; report: InterviewReport }>(
      `/shared/${token}`
    );
    return response.data.report;
  },

  chat: async (reportId: string, message: string): Promise<{ reply: string; chatHistory: ChatMessage[] }> => {
    const response = await api.post<{ message: string; reply: string; chatHistory: ChatMessage[] }>(
      `/interview-reports/${reportId}/chat`,
      { message }
    );
    return { reply: response.data.reply, chatHistory: response.data.chatHistory };
  },

  getChatHistory: async (reportId: string): Promise<{ chatHistory: ChatMessage[]; reportTitle: string; matchScore: number }> => {
    const response = await api.get<{ message: string; chatHistory: ChatMessage[]; reportTitle: string; matchScore: number }>(
      `/interview-reports/${reportId}/chat`
    );
    return {
      chatHistory: response.data.chatHistory,
      reportTitle: response.data.reportTitle,
      matchScore: response.data.matchScore,
    };
  },

  clearChatHistory: async (reportId: string): Promise<void> => {
    await api.delete(`/interview-reports/${reportId}/chat`);
  },

  downloadResume: async (id: string, customization?: Partial<ResumeCustomization>) => {
    const params = new URLSearchParams();
    if (customization) {
      Object.entries(customization).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object") {
            Object.entries(value as Record<string, boolean>).forEach(([nestedKey, nestedValue]) => {
              params.append(`${key}[${nestedKey}]`, nestedValue ? "1" : "0");
            });
          } else if (typeof value === "boolean") {
            params.append(key, value ? "1" : "0");
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const queryString = params.toString();
    const url = `/interview-reports/${id}/resume${queryString ? `?${queryString}` : ""}`;
    const response = await api.get(url, {
      responseType: "blob",
    });
    const blobUrl = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `resume_${id}.pdf`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  },
};
