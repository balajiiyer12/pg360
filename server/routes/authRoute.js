import Router from "express";
import { signUp,login, logout } from "../controller/authController.js";

const router = Router();

router.post("/signup",signUp);
router.post("/login",login);
router.get("/logout",logout);

export default router;