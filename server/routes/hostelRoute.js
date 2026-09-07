import Router from "express";
import { createHostel, deleteHostel, editHostel, getAllHostels } from "../controller/hostelController.js";

const router = Router();

router.get('/',getAllHostels);
router.post('/',createHostel);
router.delete('/:hostelid',deleteHostel);
router.put('/:hostelid',editHostel);

export default router;