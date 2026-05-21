import multer from "multer"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
})

export const uploadResume = upload.single("resume")
