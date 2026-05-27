import { type Request, type Response } from "express";
import { InterviewReport } from "../models/InterviewReport.js";
import { generateCoverLetterContent } from "../services/ai.service.js";

export const generateCoverLetterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { reportId, tone, length } = req.body as {
    reportId?: string;
    tone?: "professional" | "friendly" | "confident";
    length?: "short" | "medium" | "long";
  };

  if (!reportId) {
    res.status(400).json({ message: "Report ID is required." });
    return;
  }

  const report = await InterviewReport.findOne({
    _id: reportId,
    user: req.user!._id,
  });

  if (!report) {
    res.status(404).json({ message: "Interview report not found." });
    return;
  }

  const content = await generateCoverLetterContent({
    resume: report.resume || report.selfDescription || "",
    jobDescription: report.jobDescription,
    matchScore: report.matchScore || 0,
    tone: tone || "professional",
    length: length || "medium",
  });

  const preview = content.slice(0, 200) + (content.length > 200 ? "..." : "");

  res.status(200).json({
    message: "Cover letter generated successfully.",
    content,
    preview,
  });
};
