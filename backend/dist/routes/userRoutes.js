"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/get-unverified-artisans", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), usersController_1.getUnverifiedArtisans);
router.post("/send-verification-email/:artisanId", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["admin"]), usersController_1.sendVerificationEmailToArtisan);
router.post("/set-artisan-password/:token", usersController_1.setArtisanPassword);
exports.default = router;
