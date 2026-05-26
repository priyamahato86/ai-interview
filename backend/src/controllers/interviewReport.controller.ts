import { type Request, type Response } from "express"
import { InterviewReport } from "../models/InterviewReport.js"
import {
    extractTextFromPdf,
    generateInterviewReport,
    generateResumePdf,
} from "../services/ai.service.js"
import type { ResumeCustomization } from "../schemas/resume.js"

export const generateInterviewReportController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { selfDescription, jobDescription } = req.body as {
        selfDescription?: string
        jobDescription?: string
    }

    if (!jobDescription?.trim()) {
        res.status(400).json({ message: "Job description is required." })
        return
    }

    if (!selfDescription?.trim() && !req.file) {
        res.status(400).json({ message: "A PDF resume or self-description is required." })
        return
    }

    const resumeText = req.file
        ? await extractTextFromPdf(req.file.buffer)
        : selfDescription!

    const aiResult = await generateInterviewReport({
        resume: resumeText,
        selfDescription: selfDescription ?? resumeText,
        jobDescription,
    })

    const interviewReport = await InterviewReport.create({
        user: req.user!._id,
        resume: resumeText,
        selfDescription: selfDescription ?? "",
        jobDescription,
        ...aiResult,
        title: aiResult.title?.trim() || jobDescription.split("\n").find(l => l.trim())?.slice(0, 100) || "Interview Report",
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport,
    })
}

export const getInterviewReportByIdController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { interviewId } = req.params

    const interviewReport = await InterviewReport.findOne({
        _id: interviewId,
        user: req.user!._id,
    })

    if (!interviewReport) {
        res.status(404).json({ message: "Interview report not found." })
        return
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport,
    })
}

export const getAllInterviewReportsController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const interviewReports = await InterviewReport.find({ user: req.user!._id })
        .sort({ createdAt: -1 })
        .select(
            "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
        )

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports,
    })
}

export const generateResumePdfController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { interviewId } = req.params

    const interviewReport = await InterviewReport.findOne({
        _id: interviewId,
        user: req.user!._id,
    })

    if (!interviewReport) {
        res.status(404).json({ message: "Interview report not found." })
        return
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    if (!resume || !selfDescription || !jobDescription) {
        res.status(422).json({
            message: "This report lacks sufficient data to generate a resume PDF.",
        })
        return
    }

    const q = req.query as Record<string, string | undefined>
    const customization: Partial<ResumeCustomization> & Record<string, unknown> = {}
    if (q.pageCount) customization.pageCount = q.pageCount
    if (q.theme) customization.theme = q.theme
    if (q.layout) customization.layout = q.layout
    if (q.colorScheme) customization.colorScheme = q.colorScheme
    if (q.fontFamily) customization.fontFamily = q.fontFamily
    if (q.summaryLength) customization.summaryLength = q.summaryLength
    if (q.experienceDetail) customization.experienceDetail = q.experienceDetail
    if (q["sections[summary]"]) {
      customization.sections = {
        summary: q["sections[summary]"] === "1" || q["sections[summary]"] === "yes",
        experience: q["sections[experience]"] === "1" || q["sections[experience]"] === "yes",
        education: q["sections[education]"] === "1" || q["sections[education]"] === "yes",
        skills: q["sections[skills]"] === "1" || q["sections[skills]"] === "yes",
        projects: q["sections[projects]"] === "1" || q["sections[projects]"] === "yes",
        certifications: q["sections[certifications]"] === "1" || q["sections[certifications]"] === "yes",
      }
    }

    const cleanerCustomization: Partial<ResumeCustomization> = {}
    if (customization.pageCount) cleanerCustomization.pageCount = customization.pageCount as "1" | "2" | "3"
    if (customization.theme) cleanerCustomization.theme = customization.theme as ResumeCustomization["theme"]
    if (customization.layout) cleanerCustomization.layout = customization.layout as ResumeCustomization["layout"]
    if (customization.colorScheme) cleanerCustomization.colorScheme = customization.colorScheme as ResumeCustomization["colorScheme"]
    if (customization.fontFamily) cleanerCustomization.fontFamily = customization.fontFamily as ResumeCustomization["fontFamily"]
    if (customization.experienceDetail) cleanerCustomization.experienceDetail = customization.experienceDetail as ResumeCustomization["experienceDetail"]
    if (customization.sections) cleanerCustomization.sections = customization.sections as ResumeCustomization["sections"]

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription }, Object.keys(cleanerCustomization).length > 0 ? cleanerCustomization : undefined)

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,
        "Content-Length": pdfBuffer.length.toString(),
    })
    res.send(pdfBuffer)
}
