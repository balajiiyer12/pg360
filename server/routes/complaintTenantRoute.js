import Router from "express";
import { createComplaint, viewMycomplaints } from "../controller/complaintController.js";

const router = Router();

router.get('/',viewMycomplaints);
router.post('/',createComplaint);

export default router;