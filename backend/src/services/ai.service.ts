import { GoogleGenAI } from "@google/genai"
import { PDFParse } from "pdf-parse"
import puppeteer from "puppeteer"
import type { ResumeCustomization } from "../schemas/resume.js"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY ?? "" })

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InterviewReportAIResult {
    title: string
    matchScore: number
    technicalQuestions: { question: string; intention: string; answer: string }[]
    behavioralQuestions: { question: string; intention: string; answer: string }[]
    skillGaps: { skill: string; severity: "low" | "medium" | "high" }[]
    preparationPlan: { day: number; focus: string; tasks: string[] }[]
}

// ── Gemini-native response schemas ────────────────────────────────────────────

const questionItemSchema = {
    type: "object",
    properties: {
        question: { type: "string" },
        intention: { type: "string" },
        answer: { type: "string" },
    },
    required: ["question", "intention", "answer"],
}

const interviewReportSchema = {
    type: "object",
    properties: {
        title: { type: "string", description: "Job title derived from the job description" },
        matchScore: { type: "number", description: "Score 0-100 indicating how well the candidate matches the job" },
        technicalQuestions: { type: "array", items: questionItemSchema },
        behavioralQuestions: { type: "array", items: questionItemSchema },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                },
                required: ["skill", "severity"],
            },
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } },
                },
                required: ["day", "focus", "tasks"],
            },
        },
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
}

const resumeHtmlSchema = {
    type: "object",
    properties: {
        html: { type: "string", description: "Complete self-contained HTML with inline CSS for the resume, ATS-friendly" },
    },
    required: ["html"],
}

// ── PDF text extraction ───────────────────────────────────────────────────────

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    await parser.destroy()
    const text = result.text.trim()
    if (!text) throw new Error("Could not extract text from the uploaded PDF.")
    return text
}

// ── Interview report generation ───────────────────────────────────────────────

export async function generateInterviewReport(params: {
    resume: string
    selfDescription: string
    jobDescription: string
}): Promise<InterviewReportAIResult> {
    const { resume, selfDescription, jobDescription } = params

    const prompt = `You are an expert interview coach. Generate a comprehensive interview preparation report for the candidate below.

Resume:
${resume}

Candidate self-description:
${selfDescription}

Job description:
${jobDescription}

Provide 5–8 technical questions, 4–6 behavioral questions, all relevant skill gaps, and a 7-day preparation plan tailored to close those gaps.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responseSchema: interviewReportSchema as any,
        },
    })

    return JSON.parse(response.text!) as InterviewReportAIResult
}

// ── Resume PDF generation ─────────────────────────────────────────────────────

async function renderHtmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    try {
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: "load" })
        const pdf = await page.pdf({
            format: "A4",
            margin: { top: "10mm", bottom: "10mm", left: "12mm", right: "12mm" },
            printBackground: true,
        })
        return Buffer.from(pdf)
    } finally {
        await browser.close()
    }
}

export async function generateResumePdf(
    params: {
        resume: string
        selfDescription: string
        jobDescription: string
    },
    customization?: Partial<ResumeCustomization>
): Promise<Buffer> {
    const { resume, selfDescription, jobDescription } = params

    const merged: ResumeCustomization = {
        pageCount: customization?.pageCount ?? "1",
        theme: customization?.theme ?? "modern",
        layout: customization?.layout ?? "header-main",
        colorScheme: customization?.colorScheme ?? "blue",
        fontFamily: customization?.fontFamily ?? "inter",
        sections: customization?.sections ?? {},
        summaryLength: customization?.summaryLength ?? "standard",
        experienceDetail: customization?.experienceDetail ?? "standard",
    }

    const prompt = buildResumePrompt({ resume, selfDescription, jobDescription, customization: merged })

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responseSchema: resumeHtmlSchema as any,
        },
    })

    const { html } = JSON.parse(response.text!) as { html: string }
    return renderHtmlToPdf(html)
}

function buildResumePrompt(params: {
    resume: string
    selfDescription: string
    jobDescription: string
    customization: ResumeCustomization
}): string {
    const { resume, selfDescription, jobDescription, customization } = params

    const pageInstructions: Record<string, string> = {
        "1": "Fit ALL content on EXACTLY 1 page. Be very concise — shorten bullet points, remove less important items if needed.",
        "2": "Fill 1-2 pages with good detail. Use full bullet points and section coverage. Expand content where needed.",
        "3": "Create a comprehensive 2-3 page resume with FULL details. Write complete bullet points with specific achievements, metrics, and context. Do NOT compress or cut content.",
    }

    const themeInstructions: Record<string, string> = {
        modern: "Use a modern, clean design with bold section headers, tight spacing, and contemporary typography.",
        classic: "Use a traditional, conservative design with clear section dividers, serif or traditional fonts, and formal layout.",
        minimal: "Use an ultra-clean, minimalist approach with thin dividers, restrained color use, and efficient use of space.",
        professional: "Use a polished, corporate-friendly design with clear hierarchy, structured section organization, and professional color accents.",
    }

    const layoutInstructions: Record<string, string> = {
        "header-main": "Single column layout: name and contact in a compact header, followed by sections stacked vertically with tight spacing.",
        "alternating-blocks": "Single column layout: name and contact in compact header, then sections stacked vertically with alternating subtle background shading between entries.",
        "card-grid": "Single column layout: name and contact in compact header, entries presented as compact cards stacked vertically.",
    }

    const summaryInstructions: Record<string, string> = {
        brief: "Write a 1-2 sentence professional summary highlighting the candidate's primary value proposition.",
        standard: "Write a concise 2-3 sentence professional summary covering career focus and key strengths.",
        detailed: "Write a full professional summary paragraph (4-6 sentences) covering career trajectory, specific technical skills, notable achievements, and career goals.",
    }

    const experienceInstructions: Record<string, string> = {
        concise: "List each position with title and company. Include 1 bullet point per role, max 10 words.",
        standard: "Include title, company, dates, and 1-2 concise bullet points per role.",
        detailed: "Include title, company, dates, and 3-4 detailed bullet points per role with specific achievements and metrics.",
    }

    const sections = { ...{ summary: true, experience: true, education: true, skills: true, projects: true, certifications: false }, ...customization.sections }
    const enabledSections: string[] = [
        sections.summary !== false && "Summary (professional summary)",
        sections.experience !== false && "Experience (work history with achievements)",
        sections.education !== false && "Education (degrees and certifications)",
        sections.skills !== false && "Skills (technical and professional competencies)",
        sections.projects !== false && "Projects (notable work or contributions)",
        sections.certifications !== false && "Certifications (professional credentials)",
    ].filter(Boolean) as string[]

    const colorMap: Record<string, string> = {
        blue: "#1e40af",
        slate: "#334155",
        teal: "#0f766e",
    }
    const primaryColor = colorMap[customization.colorScheme] || "#1e40af"

    return `You are a professional resume writer. Create a tailored, ATS-friendly resume in HTML format for the candidate below.

CANDIDATE INFORMATION:
Resume (existing content to draw from):
${resume}

Candidate self-description:
${selfDescription}

Target job description:
${jobDescription}

TEMPLATE & STYLE:
- Theme: ${customization.theme} — ${themeInstructions[customization.theme]}
- Layout: ${layoutInstructions[customization.layout]}
- Color scheme: use "${customization.colorScheme}" as accent color — primary accent value is ${primaryColor}. Use this as an accent for section headers, dividers, or decorative elements. Keep text dark (#1f2937) on white background.
- Font family: ${customization.fontFamily} as the primary typeface.

PAGE COUNT TARGET: ${pageInstructions[customization.pageCount]}

REQUIRED SECTIONS: ${enabledSections.join(", ")}

LAYOUT & SPACING (varies by page count):
- Start the content (name) right at the top of the page — no large top margin or padding.
${customization.pageCount === "1" ? `- Header: name (24px bold), title (12px), contact (10px) — all within 2-3cm. TIGHT spacing: margin-bottom 8-12px, line-height 1.3, body font 10-11px, bullet gap 4-6px, section headers 11px uppercase.` : ""}
${customization.pageCount === "2" ? `- Header: name (24px bold), title (12px), contact (10px). MODERATE spacing: margin-bottom 10-14px, line-height 1.4, body font 11px, comfortable bullet spacing, section headers 11-12px uppercase.` : ""}
${customization.pageCount === "3" ? `- Header: name (26px bold), title (13px), contact (11px). STANDARD professional spacing: margin-bottom 12-16px, line-height 1.5, body font 11-12px, generous bullet spacing — aim for 2-3 full pages.` : ""}

SECTION-SPECIFIC GUIDELINES:
- Summary: ${summaryInstructions[customization.summaryLength]}
- Experience: ${experienceInstructions[customization.experienceDetail]}
- Skills: Group by category (Technical Skills, Tools & Technologies, Soft Skills). For 3-page resumes, list skills in multiple lines with descriptions.
- Education: Include degree, institution, and graduation year. One line per entry.
${sections.projects !== false ? `- Projects: Include detailed descriptions with specific outcomes and technologies used.` : ""}
${sections.certifications !== false ? `- Certifications: List professional certifications with issuing organization and year. One line each.` : ""}

CRITICAL REQUIREMENTS:
- Return a single HTML document with all styles inlined (no external CSS or JS)
- Import Google Font for the specified font family using @import in <style>
- Name must start within 5-10mm from the TOP of the PDF page — no large header margins.
- For page count "${customization.pageCount}": ${pageInstructions[customization.pageCount]}
- ATS-friendly: Use standard section headings, avoid tables/graphics for content, plain text contact info
- Every piece of content must be derivable from the provided resume or self-description — do not invent facts
- Structure HTML semantically with appropriate heading levels (h1 for name, h2 for section titles)
- Ensure the HTML renders well as a PDF (A4, 210mm x 297mm)`
}

// ── Chat / Mock Interview ─────────────────────────────────────────────────────

interface ChatContext {
    jobDescription: string;
    resume: string;
    selfDescription: string;
    matchScore: number;
    technicalQuestions: { question: string; intention: string; answer: string }[];
    behavioralQuestions: { question: string; intention: string; answer: string }[];
    skillGaps: { skill: string; severity: "low" | "medium" | "high" }[];
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
}

export async function generateChatResponse(
    context: ChatContext,
    chatHistory: ChatMessage[]
): Promise<string> {
    const technicalQs = context.technicalQuestions.map((q, i) =>
        `${i + 1}. ${q.question}`
    ).join("\n");

    const behavioralQs = context.behavioralQuestions.map((q, i) =>
        `${i + 1}. ${q.question}`
    ).join("\n");

    const skillGaps = context.skillGaps.map(g =>
        `- ${g.skill} (${g.severity} priority)`
    ).join("\n");

    const previousMessages = chatHistory
        .slice(0, -1) // Exclude the current user message
        .map(m => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
        .join("\n");

    const prompt = `You are an expert interview coach conducting a realistic mock interview. Use the context below to ask relevant follow-up questions, provide feedback, or continue the interview conversation naturally.

CANDIDATE CONTEXT:
Job Description: ${context.jobDescription}
Match Score: ${context.matchScore}/100

Candidate's Background:
${context.resume || context.selfDescription}

Available Technical Questions (use these as inspiration):
${technicalQs}

Available Behavioral Questions (use these as inspiration):
${behavioralQs}

Skill Gaps to Address:
${skillGaps}

Previous Conversation:
${previousMessages || "This is the start of the interview."}

INSTRUCTIONS:
- Ask one focused follow-up question at a time based on the conversation flow
- OR provide constructive feedback on the candidate's previous answer
- OR ask a new relevant question from the available questions
- Keep responses concise (2-4 sentences for questions, 3-5 sentences for feedback)
- Be encouraging but realistic
- If the candidate asks for tips, provide actionable advice
- Reference specific skills from the skill gaps when relevant
- Maintain a professional but friendly tone`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text?.trim() || "I'm not sure how to respond to that. Would you like to try another approach or ask about a specific question?";
}

// ── Cover Letter Generation ───────────────────────────────────────────────────

interface CoverLetterParams {
    resume: string;
    jobDescription: string;
    matchScore: number;
    tone: "professional" | "friendly" | "confident";
    length: "short" | "medium" | "long";
}

export async function generateCoverLetterContent(
    params: CoverLetterParams
): Promise<string> {
    const { resume, jobDescription, matchScore, tone, length } = params;

    const toneInstructions: Record<string, string> = {
        professional: "Use a professional, formal tone that emphasizes qualifications and alignment with company values.",
        friendly: "Use a warm, personable tone that highlights cultural fit and enthusiasm while maintaining professionalism.",
        confident: "Use a bold, assertive tone that emphasizes achievements, impact, and direct value proposition.",
    };

    const lengthInstructions: Record<string, string> = {
        short: "Write a concise cover letter of 150-200 words. Get straight to the point with key qualifications.",
        medium: "Write a standard cover letter of 250-300 words. Cover introduction, qualifications, and closing.",
        long: "Write a comprehensive cover letter of 400-500 words. Provide detailed examples of achievements and specific alignment with the role.",
    };

    const prompt = `You are an expert cover letter writer. Generate a compelling, personalized cover letter based on the provided information.

CANDIDATE INFORMATION:
Resume/Background:
${resume || "No resume provided - use the self-description below"}

Target Job Description:
${jobDescription}

Match Score: ${matchScore}/100

REQUIREMENTS:
- Tone: ${toneInstructions[tone]}
- Length: ${lengthInstructions[length]}
- Address the key requirements from the job description
- Highlight relevant skills and experience that match the role
- Show genuine interest in the company and role
- Include a strong opening hook and clear call to action
- Do NOT use placeholders like [Company Name] - use "your company" or "the team"
- Do NOT invent specific company facts - keep it generic and adaptable

Write ONLY the cover letter content. No headers, no subject lines, no salutations beyond "Dear Hiring Manager,".`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text?.trim() || "";
}
