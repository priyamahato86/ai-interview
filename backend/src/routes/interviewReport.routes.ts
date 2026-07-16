import { Router } from "express";
import { z } from "zod";
import { protect } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  generateReportSchema,
  updateProgressSchema,
} from "../schemas/interview.js";
import {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  updateProgressController,
} from "../controllers/interviewReport.controller.js";
import {
  shareReportController,
  unshareReportController,
} from "../controllers/share.controller.js";
import {
  chatController,
  getChatHistoryController,
  clearChatHistoryController,
} from "../controllers/chat.controller.js";

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

router.post(
  "/:interviewId/share",
  validate({ params: objectIdSchema }),
  shareReportController
);

router.delete(
  "/:interviewId/share",
  validate({ params: objectIdSchema }),
  unshareReportController
);

router.patch(
  "/:interviewId/progress",
  validate({ params: objectIdSchema, body: updateProgressSchema }),
  updateProgressController
);

// Chat endpoints
router.post(
  "/:interviewId/chat",
  validate({ params: objectIdSchema }),
  chatController
);

router.get(
  "/:interviewId/chat",
  validate({ params: objectIdSchema }),
  getChatHistoryController
);

router.delete(
  "/:interviewId/chat",
  validate({ params: objectIdSchema }),
  clearChatHistoryController
);

export default router;
