export interface TechnicalQuestion {
  question: string;
  intention: string;
  answer: string;
}

export interface BehavioralQuestion {
  question: string;
  intention: string;
  answer: string;
}

export interface SkillGap {
  skill: string;
  severity: "low" | "medium" | "high";
}

export interface PreparationPlan {
  day: number;
  focus: string;
  tasks: string[];
}

export interface InterviewReportSummary {
  _id: string;
  matchScore: number;
  title: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewReport extends InterviewReportSummary {
  jobDescription: string;
  resume?: string;
  selfDescription?: string;
  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];
  skillGaps: SkillGap[];
  preparationPlan: PreparationPlan[];
}
