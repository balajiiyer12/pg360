import { and, eq } from "drizzle-orm";
import { db } from "../db.js";
import { hostels, rooms } from "../schema/schema.js";

// GET ALL ROOMS FOR A SPECIFIC HOSTEL
export const getAllRoom = async (req, res) => {
  try {
    const { hostelid } = req.params;

    // Verify hostel exists first
    const [existingHostel] = await db
      .select()
      .from(hostels)
      .where(eq(hostels.hostelId, hostelid));

    if (!existingHostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    const allRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.hostelId, hostelid));

    return res.status(200).json({ success: true, allRooms });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE ROOM IN A HOSTEL
export const createRoom = async (req, res) => {
  try {
    const { roomName, capacity, rent, hostelId } = req.body;

    if (!roomName || !capacity || !rent || !hostelId) {
      return res
        .status(400)
        .json({ success: false, message: "Enter all fields" });
    }

    // Verify hostel exists
    const [existingHostel] = await db
      .select()
      .from(hostels)
      .where(eq(hostels.hostelId, hostelId));

    if (!existingHostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    // Prevent duplicate room names inside the same hostel
    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(
        and(eq(rooms.roomName, roomName), eq(rooms.hostelId, hostelId))
      );

    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "A room with this name already exists in this hostel",
      });
    }

    const [newRoom] = await db
      .insert(rooms)
      .values({
        roomName,
        capacity,
        rent,
        hostelId,
      })
      .returning();

    return res.status(201).json({ success: true, newRoom });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// EDIT A ROOM BY ROOM ID
export const editRoom = async (req, res) => {
  try {
    const { roomid } = req.params;

    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomId, roomid));

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const [updatedRoom] = await db
      .update(rooms)
      .set(req.body)
      .where(eq(rooms.roomId, roomid))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Room edited successfully",
      updatedRoom,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE A ROOM BY ROOM ID
export const deleteRoom = async (req, res) => {
  try {
    const { roomid } = req.params;

    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomId, roomid));

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await db.delete(rooms).where(eq(rooms.roomId, roomid));

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      deletedRoom: existingRoom,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};