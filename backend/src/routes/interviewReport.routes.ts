import { Router } from "express"
import { protect } from "../middleware/auth.middleware.js"
import { uploadResume } from "../middleware/upload.middleware.js"
import {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
} from "../controllers/interviewReport.controller.js"

const router = Router()

router.use(protect)

router.post("/", uploadResume, generateInterviewReportController)
router.get("/", getAllInterviewReportsController)
router.get("/:interviewId", getInterviewReportByIdController)
router.get("/:interviewId/resume", generateResumePdfController)

export default router
