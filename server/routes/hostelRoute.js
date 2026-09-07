import Router from "express";
import { createHostel, deleteHostel, editHostel } from "../controller/hostelController.js";

const router = Router();

router.post('/',createHostel);
router.delete('/:hostelid',deleteHostel);
router.put('/:hostelid',editHostel);

export default router;