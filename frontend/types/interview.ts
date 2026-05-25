// Re-export types from local schemas
// Types are defined in @/lib/schemas/interview.ts

export type {
  InterviewReport,
  InterviewReportSummary,
  TechnicalQuestion,
  BehavioralQuestion,
  SkillGap,
  PreparationPlan,
} from "@/lib/schemas/interview";

export {
  interviewReportSchema,
  interviewReportSummarySchema,
  technicalQuestionSchema,
  behavioralQuestionSchema,
  skillGapSchema,
  preparationPlanSchema,
} from "@/lib/schemas/interview";
