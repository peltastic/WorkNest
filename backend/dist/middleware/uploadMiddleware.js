"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Define upload directory
const uploadDir = path_1.default.join(__dirname, "../uploads");
// Ensure the directory exists
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const uploadMiddleware = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            // Create directory dynamically
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    // limits: { fileSize: 50 * 1024 * 1024 }, // 5MB file size limit// Temporarily store files on disk
});
exports.default = uploadMiddleware;
