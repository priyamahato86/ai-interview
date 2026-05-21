import mongoose, { Schema, type Model, type HydratedDocument } from "mongoose";

export interface ITechnicalQuestion {
  question: string;
  intention: string;
  answer: string;
}

export interface IBehavioralQuestion {
  question: string;
  intention: string;
  answer: string;
}

export interface ISkillGap {
  skill: string;
  severity: "low" | "medium" | "high";
}

export interface IPreparationPlan {
  day: number;
  focus: string;
  tasks: string[];
}

export interface IInterviewReport {
  jobDescription: string;
  resume?: string;
  selfDescription?: string;
  matchScore?: number;
  technicalQuestions: ITechnicalQuestion[];
  behavioralQuestions: IBehavioralQuestion[];
  skillGaps: ISkillGap[];
  preparationPlan: IPreparationPlan[];
  user: mongoose.Types.ObjectId;
  title: string;
}

export type InterviewReportDoc = HydratedDocument<IInterviewReport>;
type InterviewReportModel = Model<IInterviewReport>;

const technicalQuestionSchema = new Schema<ITechnicalQuestion>(
  {
    question: { type: String, required: [true, "Technical question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { _id: false }
);

const behavioralQuestionSchema = new Schema<IBehavioralQuestion>(
  {
    question: { type: String, required: [true, "Behavioral question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { _id: false }
);

const skillGapSchema = new Schema<ISkillGap>(
  {
    skill: { type: String, required: [true, "Skill is required"] },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  { _id: false }
);

const preparationPlanSchema = new Schema<IPreparationPlan>(
  {
    day: { type: Number, required: [true, "Day is required"] },
    focus: { type: String, required: [true, "Focus is required"] },
    tasks: [{ type: String, required: [true, "Task is required"] }],
  },
  { _id: false }
);

const interviewReportSchema = new Schema<IInterviewReport, InterviewReportModel>(
  {
    jobDescription: { type: String, required: [true, "Job description is required"] },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
    title: { type: String, required: [true, "Job title is required"] },
  },
  { timestamps: true }
);

export const InterviewReport = mongoose.model<IInterviewReport, InterviewReportModel>(
  "InterviewReport",
  interviewReportSchema
);
