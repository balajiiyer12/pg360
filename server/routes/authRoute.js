import Router from "express";
import { signUp, login, logout, getMe } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

export default router;