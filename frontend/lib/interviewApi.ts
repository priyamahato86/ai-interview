import { api } from "@/lib/api";
import type { InterviewReport, InterviewReportSummary } from "@/types/interview";

export const interviewApi = {
  getAllReports: () =>
    api.get<{ message: string; interviewReports: InterviewReportSummary[] }>(
      "/interview-reports"
    ),

  getReportById: (id: string) =>
    api.get<{ message: string; interviewReport: InterviewReport }>(
      `/interview-reports/${id}`
    ),

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
