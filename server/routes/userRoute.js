import Router from "express";
import { createUser, deleteUser, editUser, getTenantsByHostel } from "../controller/userController.js";

const router = Router();

router.post('/', createUser);
router.get('/hostel/:hostelid', getTenantsByHostel);
router.delete('/:userid', deleteUser);
router.put('/:userid', editUser);

export default router;