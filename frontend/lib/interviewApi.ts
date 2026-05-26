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

export const interviewApi = {
  getAllReports: async (): Promise<InterviewReportSummary[]> => {
    const response = await api.get<{ message: string; interviewReports: InterviewReportSummary[] }>(
      "/interview-reports"
    );

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

  downloadResume: async (id: string, customization?: Partial<ResumeCustomization>) => {
    const params = new URLSearchParams();
    if (customization) {
      Object.entries(customization).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object") {
            Object.entries(value as Record<string, boolean>).forEach(([nestedKey, nestedValue]) => {
              // Send "1"/"0" instead of "true"/"false" for booleans
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
