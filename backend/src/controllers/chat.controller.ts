import { type Request, type Response } from "express";
import { InterviewReport } from "../models/InterviewReport.js";
import { generateChatResponse } from "../services/ai.service.js";

export const chatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { interviewId } = req.params;
  const { message } = req.body as { message?: string };

  if (!message?.trim()) {
    res.status(400).json({ message: "Message is required." });
    return;
  }

  const report = await InterviewReport.findOne({
    _id: interviewId,
    user: req.user!._id,
  });

  if (!report) {
    res.status(404).json({ message: "Interview report not found." });
    return;
  }

  // Add user message to chat history
  report.chatHistory = report.chatHistory || [];
  report.chatHistory.push({
    role: "user",
    content: message.trim(),
    timestamp: new Date(),
  });

  // Build context from report
  const context = {
    jobDescription: report.jobDescription,
    resume: report.resume || "",
    selfDescription: report.selfDescription || "",
    matchScore: report.matchScore || 0,
    technicalQuestions: report.technicalQuestions,
    behavioralQuestions: report.behavioralQuestions,
    skillGaps: report.skillGaps,
  };

  // Generate AI response
  const aiReply = await generateChatResponse(context, report.chatHistory);

  // Add AI response to chat history
  report.chatHistory.push({
    role: "assistant",
    content: aiReply,
    timestamp: new Date(),
  });

  await report.save();

  res.status(200).json({
    message: "Chat response generated.",
    reply: aiReply,
    chatHistory: report.chatHistory,
  });
};

export const getChatHistoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { interviewId } = req.params;

  const report = await InterviewReport.findOne({
    _id: interviewId,
    user: req.user!._id,
  }).select("chatHistory title matchScore");

  if (!report) {
    res.status(404).json({ message: "Interview report not found." });
    return;
  }

  res.status(200).json({
    message: "Chat history fetched.",
    chatHistory: report.chatHistory || [],
    reportTitle: report.title,
    matchScore: report.matchScore,
  });
};

export const clearChatHistoryController = async (
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

  report.chatHistory = [];
  await report.save();

  res.status(200).json({
    message: "Chat history cleared.",
  });
};
