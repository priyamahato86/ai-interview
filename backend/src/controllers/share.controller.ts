import crypto from "crypto";
import { type Request, type Response } from "express";
import { InterviewReport } from "../models/InterviewReport.js";

export const shareReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { interviewId } = req.params;

  const report = await InterviewReport.findOne({
    _id: interviewId,
    user: req.user!._id,
  });

  if (!report) {
    res.status(404).json({ message: "Interview report not found." });
    return;
  }

  if (!report.shareToken) {
    report.shareToken = crypto.randomBytes(32).toString("hex");
    report.isShared = true;
    await report.save();
  } else {
    report.isShared = true;
    await report.save();
  }

  const shareUrl = `/shared/${report.shareToken}`;

  res.status(200).json({
    message: "Report shared successfully.",
    shareUrl,
    shareToken: report.shareToken,
  });
};

export const unshareReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { interviewId } = req.params;

  const report = await InterviewReport.findOne({
    _id: interviewId,
    user: req.user!._id,
  });

  if (!report) {
    res.status(404).json({ message: "Interview report not found." });
    return;
  }

  report.isShared = false;
  await report.save();

  res.status(200).json({
    message: "Report unshared successfully.",
  });
};

export const getSharedReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.params;

  const report = await InterviewReport.findOne({
    shareToken: token,
    isShared: true,
  }).select(
    "title matchScore technicalQuestions behavioralQuestions skillGaps preparationPlan createdAt"
  );

  if (!report) {
    res.status(404).json({ message: "Shared report not found or no longer available." });
    return;
  }

  res.status(200).json({
    message: "Shared report fetched successfully.",
    report,
  });
};
