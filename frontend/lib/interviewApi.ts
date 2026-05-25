import { api } from "@/lib/api";
import { z } from "zod";
import {
  interviewReportSchema,
  interviewReportSummarySchema,
  type InterviewReport,
  type InterviewReportSummary,
} from "@/lib/schemas/interview";

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

  downloadResume: async (id: string) => {
    const response = await api.get(`/interview-reports/${id}/resume`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume_${id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
