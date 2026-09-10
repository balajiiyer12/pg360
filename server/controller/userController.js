import { and, eq, or } from "drizzle-orm";
import { db } from "../db.js";
import { users, rooms } from "../schema/schema.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, roomId, hostelId } = req.body;
    if (!name || !email || !password || !hostelId) {
      return res.status(400).json({ success: false, message: "Enter all fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    let resolvedHostelId = hostelId || null;
    if (roomId && !resolvedHostelId) {
      const [roomData] = await db
        .select({ hostelId: rooms.hostelId })
        .from(rooms)
        .where(eq(rooms.roomId, roomId));
      resolvedHostelId = roomData?.hostelId || null;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "tenant",
        hostelId: resolvedHostelId,
        roomId: roomId || null,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        hostelId: users.hostelId,
        roomId: users.roomId,
      });

    return res.status(201).json({ success: true, newUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const [existingUser] = await db
      .select({ name: users.name, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, userid));

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await db.delete(users).where(eq(users.id, userid));
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: existingUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userid));

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email.toLowerCase().trim();
    if (req.body.hostelId !== undefined) updateData.hostelId = req.body.hostelId || null;
    if (req.body.roomId !== undefined) updateData.roomId = req.body.roomId || null;
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userid))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        hostelId: users.hostelId,
        roomId: users.roomId,
      });

    return res.status(200).json({
      success: true,
      message: "User Edited Successfully",
      updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTenantsByHostel = async (req, res) => {
  try {
    const { hostelid } = req.params;

    // Return ALL tenants in this hostel (both assigned to a room and unassigned)
    const tenants = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        hostelId: users.hostelId,
        roomId: users.roomId,
        roomName: rooms.roomName,
        rent: rooms.rent,
      })
      .from(users)
      .leftJoin(rooms, eq(users.roomId, rooms.roomId))
      .where(
        and(
          eq(users.role, "tenant"),
          or(
            eq(users.hostelId, hostelid),
            eq(rooms.hostelId, hostelid)
          )
        )
      );

    return res.status(200).json({ success: true, tenants });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};   