import { Request, Response } from "express";
import { ArtisanInfo } from "../models/Artisan";
import { sendEmailHandler } from "../utils/sendEmail";

import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export const getUnverifiedArtisans = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Find users where password is null or not set
    const unverifiedArtisans = await ArtisanInfo.find({
      verified: false,
    }).populate(
      "user",
      "-password" // Exclude password field
    );

    res.status(200).json({
      message: "Users without passwords fetched successfully",
      data: unverifiedArtisans,
    });
  } catch (error) {
    console.error("Error fetching users without passwords:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const sendVerificationEmailToArtisan = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { artisanId } = req.params;

    // Find unverified artisan and populate the user field
    const artisan = await ArtisanInfo.findOne({
      user: artisanId,
      verified: false,
    }).populate<{ user: IUser }>("user");

    if (!artisan || !artisan.user) {
      return res.status(404).json({ message: "Unverified artisan not found" });
    }

    // Generate a token (valid for 1 hour)
    const token = jwt.sign({ artisanId: artisan.user._id }, SECRET_KEY, {
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
    sendEmailHandler(artisan.user.email, subject, message);
    console.log(token);
    res.status(200).json({
      message: `Verification email sent ${artisan.user.email} successfully`,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ message: "Error sending verification email" });
  }
};

export const setArtisanPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Verify token
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const userId = decoded.artisanId;

    // Find artisan user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    user.password = password;
    await user.save();

    // Mark artisan as verified
    await ArtisanInfo.findOneAndUpdate({ user: userId }, { verified: true });

    res
      .status(200)
      .json({ message: "Password set successfully. Artisan verified." });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
