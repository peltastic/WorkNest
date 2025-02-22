import multer from "multer";
import path from "path";
import fs from "fs";

// Define upload directory
const uploadDir = path.join(__dirname, "../uploads");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Create directory dynamically
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  // limits: { fileSize: 50 * 1024 * 1024 }, // 5MB file size limit// Temporarily store files on disk
});

export default uploadMiddleware;
