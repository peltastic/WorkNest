import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { ArtisanInfo } from "../models/Artisan";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      city,
      address,
      state,
      role,
      password,
      skills,
    } = req.body;
    if (!["customer", "artisan"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const userExists = await User.findOne({ email, role });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });
    let user;
    if (role === "customer") {
      user = new User({
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
      await user.save();
    } else {
      user = new User({
        fname,
        lname,
        phone,
        city,
        address,
        state,
        email,
        role,
      });
      await user.save();
    }
    let artisanInfo = null;

    if (role === "artisan") {
      // Image Uploads
      let profilePictureUrl = "";
      const imageUrls: string[] = [];
      const meansOfIDUrls: string[] = [];
     
      if (req.files) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (files.images && Array.isArray(files.images)) {
          for (const file of files.images) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
          }
        }

        // Upload profile picture (Single Image)
        if (files.profilePicture?.[0]) {
          const result = await cloudinary.uploader.upload(
            files.profilePicture[0].path
          );
          profilePictureUrl = result.secure_url;
        }

        // Upload Means of ID (Array of Images)
        if (files.meansOfId?.[0]) {
          const result = await cloudinary.uploader.upload(
            files.meansOfId[0].path
          );
          meansOfIDUrls.push(result.secure_url);
        }
      }

      artisanInfo = new ArtisanInfo({
        user: user._id,
        skills: skills,
        images: imageUrls,
        profilePicture: profilePictureUrl,
        meansOfId: meansOfIDUrls,
      });
      await artisanInfo.save();
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
    } else {
      res.status(201).json({
        message: `${role} registered successfully, please wait for an email to set password`,
        data: {
          user: {
            id: user._id,
          },
        },
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
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
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// Get profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findById(req.userId).select([
      "email",
      "_id",
      "lname",
      "fname",
      "state",
      "city",
      "address",
      "phone",
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "your-secret-key";

export const registerAsAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fname, lname, email, phone, city, address, state, password, secretKey } = req.body;

    // Validate secret key
    if (secretKey !== ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: "Invalid secret key" });
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email, role: "admin" });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin user
    const admin = new User({
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
    await admin.save();

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
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Error registering admin" });
  }
};

export const loginAsAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find admin user (modify role check if needed)
    const user = await User.findOne({ email, role: "admin" });

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
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and return success response
    res.status(200).json({
      message: "Admin login successful",
      token: generateToken(user),
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};