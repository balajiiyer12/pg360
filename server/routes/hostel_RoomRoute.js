import Router from "express";
import { createHostel, deleteHostel, editHostel, getAllHostels, getHostelById, getAdminStats } from "../controller/hostelController.js";
import { createRoom, deleteRoom, editRoom, getAllRoom } from "../controller/roomController.js";

const router = Router();

router.get('/stats/overview', getAdminStats);
router.get('/', getAllHostels);
router.post('/', createHostel);
router.get('/:hostelid', getHostelById);
router.delete('/:hostelid', deleteHostel);
router.put('/:hostelid', editHostel);

//ROOM
router.put("/rooms/:roomid", editRoom);
router.delete("/rooms/:roomid", deleteRoom);
router.post("/:hostelid/room", createRoom);
router.get("/:hostelid/room", getAllRoom);

export default router;