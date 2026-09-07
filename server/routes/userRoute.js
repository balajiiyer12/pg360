import Router from "express";
import { createUser, deleteUser, editUser } from "../controller/userController";

const router = Router();

router.post('/',createUser);
router.delete('/:userid',deleteUser);
router.put('/:userid',editUser);

export default router;