import { Request, Response } from "express";
import { ArtisanInfo } from "../models/Artisan";
import User from "../models/User";

export const listArtisans = async (req: Request, res: Response) => {
  try {
    // Extract filter queries
    const {
      rating,
      city,
      state,
      minFeedbacks,
      skills, // 🔹 Enhanced search for multiple skills
      page = "1",
      limit = "10",
    } = req.query;

    // Convert pagination values to numbers
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build the filtering conditions
    const artisanFilter: any = { verified: true }; // ✅ Only fetch verified artisans
    const userFilter: any = {};

    // Filter by rating
    if (rating) {
      artisanFilter.rating = { $gte: parseFloat(rating as string) };
    }

    // Filter by minimum number of feedbacks
    if (minFeedbacks) {
      artisanFilter.feedbacks = { $exists: true, $not: { $size: 0 } }; // Ensure feedbacks exist
      artisanFilter["feedbacks.0"] = { $exists: true }; // At least one feedback
    }

    // 🔹 Robust Skills Search (Supports multiple skills)
    if (skills) {
      const skillArray = (skills as string).split(",").map((skill) => skill.trim()); // Split skills by comma
      artisanFilter.skills = { $in: skillArray.map((skill) => new RegExp(skill, "i")) };
    }

    // Filter by city or state from the User model
    if (city) userFilter.city = new RegExp(city as string, "i");
    if (state) userFilter.state = new RegExp(state as string, "i");

    // Find users matching the user filters (city, state)
    const userIds = await User.find(userFilter).select("_id").lean();

    if (userIds.length > 0) {
      artisanFilter.user = { $in: userIds.map((user) => user._id) };
    }

    // Fetch artisans with filters, pagination, and populate user details
    const artisans = await ArtisanInfo.find(artisanFilter)
      .select(["skills", "profilePicture"])
      .populate({
        path: "user",
        select: "fname lname state city phone email",
      })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Get total count of artisans for pagination info
    const totalArtisans = await ArtisanInfo.countDocuments(artisanFilter);

    res.status(200).json({
      message: "Verified artisan list retrieved successfully",
      currentPage: pageNumber,
      totalPages: Math.ceil(totalArtisans / limitNumber),
      totalArtisans,
      artisans,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching verified artisans", error });
  }
}; 


export const getArtisanById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Artisan ID is required" });
    }

    // Fetch artisan by ID and populate user details
    const artisan = await ArtisanInfo.findById(id)
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
  } catch (error) {
    res.status(500).json({ message: "Error fetching artisan details", error });
  }
};
