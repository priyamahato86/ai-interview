import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { generateCoverLetterSchema } from "../schemas/coverLetter.js";
import { generateCoverLetterController } from "../controllers/coverLetter.controller.js";

const router = Router();

router.use(protect);

router.post("/", validate({ body: generateCoverLetterSchema }), generateCoverLetterController);

export default router;
