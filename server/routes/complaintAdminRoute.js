import Router from "express";
import { getAllAdminComplaints, deleteComplaints, updateComplaintStatus, viewHostelComplaints } from "../controller/complaintController.js";

const router = Router();

router.get('/', getAllAdminComplaints);
router.get('/hostel/:hostelid', viewHostelComplaints);
router.delete('/:complaintid', deleteComplaints);
router.patch('/:complaintid', updateComplaintStatus);

export default router;