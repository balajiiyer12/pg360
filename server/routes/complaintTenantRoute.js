import Router from "express";
import { createComplaint, viewMycomplaints, deleteTenantComplaint } from "../controller/complaintController.js";

const router = Router();

router.get('/', viewMycomplaints);
router.post('/', createComplaint);
router.delete('/:complaintid', deleteTenantComplaint);

export default router;