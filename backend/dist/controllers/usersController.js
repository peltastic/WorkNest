"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setArtisanPassword = exports.sendVerificationEmailToArtisan = exports.getUnverifiedArtisans = void 0;
const Artisan_1 = require("../models/Artisan");
const sendEmail_1 = require("../utils/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const getUnverifiedArtisans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users where password is null or not set
        const unverifiedArtisans = yield Artisan_1.ArtisanInfo.find({
            verified: false,
        }).populate("user", "-password" // Exclude password field
        );
        res.status(200).json({
            message: "Users without passwords fetched successfully",
            data: unverifiedArtisans,
        });
    }
    catch (error) {
        console.error("Error fetching users without passwords:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});
exports.getUnverifiedArtisans = getUnverifiedArtisans;
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const sendVerificationEmailToArtisan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artisanId } = req.params;
        // Find unverified artisan and populate the user field
        const artisan = yield Artisan_1.ArtisanInfo.findOne({
            user: artisanId,
            verified: false,
        }).populate("user");
        if (!artisan || !artisan.user) {
            return res.status(404).json({ message: "Unverified artisan not found" });
        }
        // Generate a token (valid for 1 hour)
        const token = jsonwebtoken_1.default.sign({ artisanId: artisan.user._id }, SECRET_KEY, {
            expiresIn: "1h",
        });
        // Construct reset URL
        const resetUrl = `http://localhost:8081/pro/auth/set-password?token=${token}`;
        // Email content
        const subject = "Set Your Password & Complete Verification";
        const message = `
      <h3>Hello ${artisan.user.fname},</h3>
      <p>Click the link below to set your password and complete your verification:</p>
      <a href="${resetUrl}" style="color:blue;">Set Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
        // Send email
        (0, sendEmail_1.sendEmailHandler)(artisan.user.email, subject, message);
        console.log(token);
        res.status(200).json({
            message: `Verification email sent ${artisan.user.email} successfully`,
            data: {
                token,
            },
        });
    }
    catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({ message: "Error sending verification email" });
    }
});
exports.sendVerificationEmailToArtisan = sendVerificationEmailToArtisan;
const setArtisanPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const userId = decoded.artisanId;
        // Find artisan user
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update password
        user.password = password;
        yield user.save();
        // Mark artisan as verified
        yield Artisan_1.ArtisanInfo.findOneAndUpdate({ user: userId }, { verified: true });
        res
            .status(200)
            .json({ message: "Password set successfully. Artisan verified." });
    }
    catch (error) {
        console.error("Error setting password:", error);
        res.status(500).json({ message: "Invalid or expired token" });
    }
});
exports.setArtisanPassword = setArtisanPassword;
