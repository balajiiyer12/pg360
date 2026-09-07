import Router from "express";
import { createHostel, deleteHostel, editHostel, getAllHostels } from "../controller/hostelController.js";
import { createRoom, deleteRoom, editRoom, getAllRoom } from "../controller/roomController.js";

const router = Router();

router.get('/',getAllHostels);
router.post('/',createHostel);
router.delete('/:hostelid',deleteHostel);
router.put('/:hostelid',editHostel);

//ROOM
router.put("/rooms/:roomid",editRoom);
router.delete("/rooms/:roomid",deleteRoom);
router.post("/:hostelid/room",createRoom);
router.get("/:hostelid/room",getAllRoom);

export default router;