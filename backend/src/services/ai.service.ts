import { createRequire } from "module"
import { GoogleGenAI } from "@google/genai"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import puppeteer from "puppeteer"

const _require = createRequire(import.meta.url)
const pdfParse = _require("pdf-parse") as (
    buf: Buffer
) => Promise<{ text: string; numpages: number }>

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY ?? "" })

// ── Schemas ───────────────────────────────────────────────────────────────────

const interviewReportZodSchema = z.object({
    matchScore: z
        .number()
        .describe("Score 0-100 indicating how well the candidate matches the job"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("Technical question likely to be asked"),
            intention: z.string().describe("Why the interviewer asks this"),
            answer: z.string().describe("Key points and approach for answering"),
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("Behavioral question likely to be asked"),
            intention: z.string().describe("Why the interviewer asks this"),
            answer: z.string().describe("Key points and approach for answering"),
        })
    ),
    skillGaps: z.array(
        z.object({
            skill: z.string().describe("Skill the candidate is lacking"),
            severity: z
                .enum(["low", "medium", "high"])
                .describe("Impact of this gap on candidacy"),
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number().describe("Day number starting from 1"),
            focus: z.string().describe("Main topic for the day"),
            tasks: z.array(z.string()).describe("Concrete tasks for the day"),
        })
    ),
    title: z.string().describe("Job title derived from the job description"),
})

export type InterviewReportAIResult = z.infer<typeof interviewReportZodSchema>

const resumeHtmlZodSchema = z.object({
    html: z
        .string()
        .describe(
            "Complete self-contained HTML with inline CSS for the resume, ATS-friendly"
        ),
})

// ── PDF text extraction ───────────────────────────────────────────────────────

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer)
    const text = data.text.trim()
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
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responseSchema: zodToJsonSchema(interviewReportZodSchema as any, {
                target: "openApi3",
            }) as any,
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
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responseSchema: zodToJsonSchema(resumeHtmlZodSchema as any, {
                target: "openApi3",
            }) as any,
        },
    })

    const { html } = JSON.parse(response.text!) as { html: string }
    return renderHtmlToPdf(html)
}
