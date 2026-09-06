import Router from "express";
import { signUp } from "../controller/authController.js";
const router = Router();

router.post("/signup",signUp);
// router.post("/login",login);

export default router;