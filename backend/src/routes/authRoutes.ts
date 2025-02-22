import express from "express";
import { register, login, getProfile, registerAsAdmin, loginAsAdmin } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import uploadMiddleware from "../middleware/uploadMiddleware";

const router = express.Router();

router.post(
  "/register",
  uploadMiddleware.fields([
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
  ]),
  register
);
router.post("/admin/register", registerAsAdmin)
router.post("/login", login);
router.post("/admin/login", loginAsAdmin)
router.get("/profile", authenticate, getProfile);

export default router;
