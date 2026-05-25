import { Router } from "express";
import { z } from "zod";
import { protect } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  generateReportSchema,
} from "../schemas/interview.js";
import {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} from "../controllers/interviewReport.controller.js";

const router = Router();

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

router.use(protect);

router.post(
  "/",
  uploadResume,
  generateInterviewReportController
);

router.get("/", getAllInterviewReportsController);

router.get(
  "/:interviewId",
  validate({ params: objectIdSchema }),
  getInterviewReportByIdController
);

router.get(
  "/:interviewId/resume",
  validate({ params: objectIdSchema }),
  generateResumePdfController
);

export default router;
