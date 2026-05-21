import { type Request, type Response } from "express"
import { InterviewReport } from "../models/InterviewReport.js"
import {
    extractTextFromPdf,
    generateInterviewReport,
    generateResumePdf,
} from "../services/ai.service.js"

export const generateInterviewReportController = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: "A valid PDF resume is required (field: resume)." })
        return
    }

    const { selfDescription, jobDescription } = req.body as {
        selfDescription?: string
        jobDescription?: string
    }

    if (!selfDescription?.trim() || !jobDescription?.trim()) {
        res.status(400).json({ message: "selfDescription and jobDescription are required." })
        return
    }

    const resumeText = await extractTextFromPdf(req.file.buffer)

    const aiResult = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
    })

    const interviewReport = await InterviewReport.create({
        user: req.user!._id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...aiResult,
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

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,
        "Content-Length": pdfBuffer.length.toString(),
    })
    res.send(pdfBuffer)
}
