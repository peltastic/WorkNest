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
exports.getArtisanById = exports.listArtisans = void 0;
const Artisan_1 = require("../models/Artisan");
const User_1 = __importDefault(require("../models/User"));
const listArtisans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract filter queries
        const { rating, city, state, minFeedbacks, skills, // 🔹 Enhanced search for multiple skills
        page = "1", limit = "10", } = req.query;
        // Convert pagination values to numbers
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        // Build the filtering conditions
        const artisanFilter = { verified: true }; // ✅ Only fetch verified artisans
        const userFilter = {};
        // Filter by rating
        if (rating) {
            artisanFilter.rating = { $gte: parseFloat(rating) };
        }
        // Filter by minimum number of feedbacks
        if (minFeedbacks) {
            artisanFilter.feedbacks = { $exists: true, $not: { $size: 0 } }; // Ensure feedbacks exist
            artisanFilter["feedbacks.0"] = { $exists: true }; // At least one feedback
        }
        // 🔹 Robust Skills Search (Supports multiple skills)
        if (skills) {
            const skillArray = skills.split(",").map((skill) => skill.trim()); // Split skills by comma
            artisanFilter.skills = { $in: skillArray.map((skill) => new RegExp(skill, "i")) };
        }
        // Filter by city or state from the User model
        if (city)
            userFilter.city = new RegExp(city, "i");
        if (state)
            userFilter.state = new RegExp(state, "i");
        // Find users matching the user filters (city, state)
        const userIds = yield User_1.default.find(userFilter).select("_id").lean();
        if (userIds.length > 0) {
            artisanFilter.user = { $in: userIds.map((user) => user._id) };
        }
        // Fetch artisans with filters, pagination, and populate user details
        const artisans = yield Artisan_1.ArtisanInfo.find(artisanFilter)
            .select(["skills", "profilePicture"])
            .populate({
            path: "user",
            select: "fname lname state city phone email",
        })
            .skip(skip)
            .limit(limitNumber)
            .exec();
        // Get total count of artisans for pagination info
        const totalArtisans = yield Artisan_1.ArtisanInfo.countDocuments(artisanFilter);
        res.status(200).json({
            message: "Verified artisan list retrieved successfully",
            currentPage: pageNumber,
            totalPages: Math.ceil(totalArtisans / limitNumber),
            totalArtisans,
            artisans,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching verified artisans", error });
    }
});
exports.listArtisans = listArtisans;
const getArtisanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Artisan ID is required" });
        }
        // Fetch artisan by ID and populate user details
        const artisan = yield Artisan_1.ArtisanInfo.findById(id)
            .select(["skills", "profilePicture", "images"]) // Adjust fields as needed
            .populate({
            path: "user",
            select: "fname lname state city phone email",
        })
            .exec();
        if (!artisan) {
            return res.status(404).json({ message: "Artisan not found" });
        }
        res.status(200).json({
            message: "Artisan details retrieved successfully",
            artisan,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching artisan details", error });
    }
});
exports.getArtisanById = getArtisanById;
