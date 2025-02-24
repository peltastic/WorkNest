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
exports.loginAsAdmin = exports.registerAsAdmin = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Artisan_1 = require("../models/Artisan");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// Generate JWT token
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
    });
};
// Register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { fname, lname, email, phone, city, address, state, role, password, skills, } = req.body;
        if (!["customer", "artisan"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const userExists = yield User_1.default.findOne({ email, role });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        let user;
        if (role === "customer") {
            user = new User_1.default({
                fname,
                lname,
                phone,
                city,
                address,
                state,
                email,
                password,
                role,
            });
            yield user.save();
        }
        else {
            user = new User_1.default({
                fname,
                lname,
                phone,
                city,
                address,
                state,
                email,
                role,
            });
            yield user.save();
        }
        let artisanInfo = null;
        if (role === "artisan") {
            // Image Uploads
            let profilePictureUrl = "";
            const imageUrls = [];
            const meansOfIDUrls = [];
            if (req.files) {
                const files = req.files;
                if (files.images && Array.isArray(files.images)) {
                    for (const file of files.images) {
                        const result = yield cloudinary_1.default.uploader.upload(file.path);
                        imageUrls.push(result.secure_url);
                    }
                }
                // Upload profile picture (Single Image)
                if ((_a = files.profilePicture) === null || _a === void 0 ? void 0 : _a[0]) {
                    const result = yield cloudinary_1.default.uploader.upload(files.profilePicture[0].path);
                    profilePictureUrl = result.secure_url;
                }
                // Upload Means of ID (Array of Images)
                if ((_b = files.meansOfId) === null || _b === void 0 ? void 0 : _b[0]) {
                    const result = yield cloudinary_1.default.uploader.upload(files.meansOfId[0].path);
                    meansOfIDUrls.push(result.secure_url);
                }
            }
            artisanInfo = new Artisan_1.ArtisanInfo({
                user: user._id,
                skills: skills,
                images: imageUrls,
                profilePicture: profilePictureUrl,
                meansOfId: meansOfIDUrls,
            });
            yield artisanInfo.save();
        }
        if (role === "customer") {
            res.status(201).json({
                message: `${role} registered successfully`,
                token: generateToken(user),
                data: {
                    user: {
                        id: user._id,
                    },
                },
            });
        }
        else {
            res.status(201).json({
                message: `${role} registered successfully, please wait for an email to set password`,
                data: {
                    user: {
                        id: user._id,
                    },
                },
            });
        }
    }
    catch (error) {
        console.log(error, "error");
        res.status(500).json({ message: "Error registering user" });
    }
});
exports.register = register;
// Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.json({
            token: generateToken(user),
            data: {
                user: {
                    id: user._id,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.login = login;
// Get profile
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.userId).select([
            "email",
            "_id",
            "lname",
            "fname",
            "state",
            "city",
            "address",
            "phone",
        ]);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({
            data: {
                user,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});
exports.getProfile = getProfile;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "your-secret-key";
const registerAsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, email, phone, city, address, state, password, secretKey } = req.body;
        // Validate secret key
        if (secretKey !== ADMIN_SECRET_KEY) {
            return res.status(403).json({ message: "Invalid secret key" });
        }
        // Check if admin already exists
        const adminExists = yield User_1.default.findOne({ email, role: "admin" });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        // Create new admin user
        const admin = new User_1.default({
            fname,
            lname,
            email,
            phone,
            city,
            address,
            state,
            password, // Will be hashed by pre-save middleware
            role: "admin",
        });
        yield admin.save();
        // Return response with token
        res.status(201).json({
            message: "Admin registered successfully",
            token: generateToken(admin),
            data: {
                user: {
                    id: admin._id,
                    email: admin.email,
                    role: admin.role,
                },
            },
        });
    }
    catch (error) {
        console.error("Admin registration error:", error);
        res.status(500).json({ message: "Error registering admin" });
    }
});
exports.registerAsAdmin = registerAsAdmin;
const loginAsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find admin user (modify role check if needed)
        const user = yield User_1.default.findOne({ email, role: "admin" });
        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Ensure admin has a password set
        if (!user.password) {
            return res.status(400).json({
                message: "This admin account does not have a password set. Please reset your password.",
            });
        }
        // Compare password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate token and return success response
        res.status(200).json({
            message: "Admin login successful",
            token: generateToken(user),
            user: { id: user._id, email: user.email, role: user.role },
        });
    }
    catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginAsAdmin = loginAsAdmin;
