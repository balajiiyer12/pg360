import { and, eq, inArray, desc } from "drizzle-orm";
import { db } from "../db.js";
import { hostels, rooms, users, complaints } from "../schema/schema.js";

export const getAllHostels = async (req, res) => {
  try {
    const allHostels = await db
      .select()
      .from(hostels)
      .where(eq(hostels.ownerId, req.user.id));
    res.status(200).json({ success: true, allHostels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const { hostelid } = req.params;
    const [hostel] = await db
      .select()
      .from(hostels)
      .where(
        and(
          eq(hostels.hostelId, hostelid),
          eq(hostels.ownerId, req.user.id)
        )
      );

    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    return res.status(200).json({ success: true, hostel });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createHostel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.body.ownerId || req.user.id;

    if (!name || !ownerId || !description) {
      return res.status(400).json({ success: false, message: "Enter all fields" });
    }

    const [existingHostel] = await db
      .select()
      .from(hostels)
      .where(
        and(
          eq(hostels.name, name),
          eq(hostels.ownerId, ownerId)
        )
      );

    if (existingHostel) {
      return res.status(409).json({
        success: false,
        message: "You have another hostel with the same name",
      });
    }

    const [newHostel] = await db
      .insert(hostels)
      .values({
        name,
        description,
        ownerId,
      })
      .returning();

    return res.status(201).json({ success: true, newHostel });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    const { hostelid } = req.params;
    const [existingHostel] = await db
      .select()
      .from(hostels)
      .where(
        and(
          eq(hostels.hostelId, hostelid),
          eq(hostels.ownerId, req.user.id)
        )
      );

    if (!existingHostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    await db.delete(hostels).where(eq(hostels.hostelId, hostelid));
    return res.status(200).json({
      success: true,
      message: "Hostel deleted successfully",
      deletedHostel: existingHostel,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const editHostel = async (req, res) => {
  try {
    const { hostelid } = req.params;
    const [existingHostel] = await db
      .select()
      .from(hostels)
      .where(
        and(
          eq(hostels.hostelId, hostelid),
          eq(hostels.ownerId, req.user.id)
        )
      );

    if (!existingHostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    const [updatedHostel] = await db
      .update(hostels)
      .set(req.body)
      .where(eq(hostels.hostelId, hostelid))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Hostel Edited Successfully",
      updatedHostel,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    // 1. Get all hostels owned by admin
    const ownerHostels = await db
      .select({ hostelId: hostels.hostelId, name: hostels.name })
      .from(hostels)
      .where(eq(hostels.ownerId, req.user.id));

    const totalHostels = ownerHostels.length;
    const hostelIds = ownerHostels.map((h) => h.hostelId);

    if (totalHostels === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          hostels: 0,
          rooms: 0,
          tenants: 0,
          complaints: 0,
          occupancy: "0%",
        },
        recentActivity: [],
      });
    }

    // 2. Get all rooms for these hostels
    const allRooms = await db
      .select({
        roomId: rooms.roomId,
        capacity: rooms.capacity,
        hostelId: rooms.hostelId,
      })
      .from(rooms)
      .where(inArray(rooms.hostelId, hostelIds));

    const totalRooms = allRooms.length;
    const totalCapacity = allRooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const roomIds = allRooms.map((r) => r.roomId);

    // 3. Count tenants assigned to these rooms
    let totalTenants = 0;
    if (roomIds.length > 0) {
      const tenants = await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            eq(users.role, "tenant"),
            inArray(users.roomId, roomIds)
          )
        );
      totalTenants = tenants.length;
    }

    // 4. Count pending complaints
    const allComplaints = await db
      .select({
        complaintId: complaints.complaintId,
        title: complaints.title,
        status: complaints.status,
        createdAt: complaints.createdAt,
      })
      .from(complaints)
      .where(inArray(complaints.hostelId, hostelIds));

    const openComplaints = allComplaints.filter((c) => c.status === "pending").length;

    // 5. Calculate occupancy rate
    const occupancyRate =
      totalCapacity > 0
        ? `${Math.min(100, Math.round((totalTenants / totalCapacity) * 100))}%`
        : totalRooms > 0 && totalTenants > 0
        ? "100%"
        : "0%";

    // 6. Recent activity (latest complaints)
    const recentActivity = allComplaints
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
      .map((c) => ({
        id: c.complaintId,
        text: `Complaint "${c.title}" is currently ${c.status}.`,
      }));

    return res.status(200).json({
      success: true,
      stats: {
        hostels: totalHostels,
        rooms: totalRooms,
        tenants: totalTenants,
        complaints: openComplaints,
        occupancy: occupancyRate,
      },
      recentActivity,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};   