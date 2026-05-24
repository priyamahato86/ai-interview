import { GoogleGenAI } from "@google/genai"
import { PDFParse } from "pdf-parse"
import puppeteer from "puppeteer"

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
            margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
            printBackground: true,
        })
        return Buffer.from(pdf)
    } finally {
        await browser.close()
    }
}

export async function generateResumePdf(params: {
    resume: string
    selfDescription: string
    jobDescription: string
}): Promise<Buffer> {
    const { resume, selfDescription, jobDescription } = params

    const prompt = `You are a professional resume writer. Create a tailored, ATS-friendly resume in HTML format for the candidate below.

Resume (existing content to draw from):
${resume}

Candidate self-description:
${selfDescription}

Target job description:
${jobDescription}

Requirements:
- Return a single HTML document with all styles inlined (no external CSS or JS)
- Professional, clean design — simple colour accents are fine, no heavy graphics
- Ideal length: 1 page; 2 pages only if the candidate has extensive relevant experience
- Use standard section headings: Summary, Experience, Education, Skills
- Quantify achievements where possible; keep language natural and human-written
- Every piece of content must be derivable from the provided resume or self-description — do not invent facts`

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
