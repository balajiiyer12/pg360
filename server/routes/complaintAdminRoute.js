import Router from "express";
import { deleteComplaints, updateComplaintStatus, viewHostelComplaints } from "../controller/complaintController.js";

const router = Router();

router.get('/hostel/:hostelid', viewHostelComplaints);
router.delete('/:complaintid',deleteComplaints);
router.patch('/:complaintsid',updateComplaintStatus);




export default router;