"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.post("/register", uploadMiddleware_1.default.fields([
    {
        name: "profilePicture",
        maxCount: 1,
    },
    {
        name: "meansOfId",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 10,
    },
]), authController_1.register);
router.post("/admin/register", authController_1.registerAsAdmin);
router.post("/login", authController_1.login);
router.post("/admin/login", authController_1.loginAsAdmin);
router.get("/profile", authMiddleware_1.authenticate, authController_1.getProfile);
exports.default = router;
