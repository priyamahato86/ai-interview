import { z } from "zod";

export const technicalQuestionSchema = z.object({
  question: z.string().min(1),
  intention: z.string().min(1),
  answer: z.string().min(1),
});
export type TechnicalQuestion = z.infer<typeof technicalQuestionSchema>;

export const behavioralQuestionSchema = z.object({
  question: z.string().min(1),
  intention: z.string().min(1),
  answer: z.string().min(1),
});
export type BehavioralQuestion = z.infer<typeof behavioralQuestionSchema>;

export const skillGapSchema = z.object({
  skill: z.string().min(1),
  severity: z.enum(["low", "medium", "high"]),
});
export type SkillGap = z.infer<typeof skillGapSchema>;

export const preparationPlanSchema = z.object({
  day: z.number().int().positive(),
  focus: z.string().min(1),
  tasks: z.array(z.string()).min(1),
});
export type PreparationPlan = z.infer<typeof preparationPlanSchema>;

export const interviewReportSchema = z.object({
  _id: z.string(),
  jobDescription: z.string(),
  resume: z.string().optional(),
  selfDescription: z.string().optional(),
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z.array(technicalQuestionSchema),
  behavioralQuestions: z.array(behavioralQuestionSchema),
  skillGaps: z.array(skillGapSchema),
  preparationPlan: z.array(preparationPlanSchema),
  user: z.string(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type InterviewReport = z.infer<typeof interviewReportSchema>;

export const interviewReportSummarySchema = z.object({
  _id: z.string(),
  matchScore: z.number().min(0).max(100),
  title: z.string(),
  user: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type InterviewReportSummary = z.infer<typeof interviewReportSummarySchema>;

export const generateReportSchema = z.object({
  selfDescription: z
    .string()
    .min(10, "Self description must be at least 10 characters")
    .max(5000, "Self description must be at most 5000 characters"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters")
    .max(10000, "Job description must be at most 10000 characters"),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;

export const updateProgressSchema = z
  .object({
    practicedQuestions: z
      .array(z.string().regex(/^(technical|behavioral)-\d+$/, "Invalid question key"))
      .max(200)
      .optional(),
    completedDays: z.array(z.number().int().positive().max(365)).max(60).optional(),
  })
  .refine(
    (data) => data.practicedQuestions !== undefined || data.completedDays !== undefined,
    { message: "At least one of practicedQuestions or completedDays is required" }
  );

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;