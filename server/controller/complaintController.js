import { complaints, hostels, users, rooms } from "../schema/schema.js";
import { db } from "../db.js";
import { and, eq, desc } from "drizzle-orm";

export const getAllAdminComplaints = async (req, res) => {
  try {
    const allComplaints = await db
      .select({
        complaintId: complaints.complaintId,
        title: complaints.title,
        description: complaints.description,
        status: complaints.status,
        createdAt: complaints.createdAt,
        hostelId: complaints.hostelId,
        hostelName: hostels.name,
        tenantName: users.name,
        tenantEmail: users.email,
        roomName: rooms.roomName,
      })
      .from(complaints)
      .innerJoin(hostels, eq(complaints.hostelId, hostels.hostelId))
      .innerJoin(users, eq(complaints.authorId, users.id))
      .leftJoin(rooms, eq(users.roomId, rooms.roomId))
      .where(eq(hostels.ownerId, req.user.id))
      .orderBy(desc(complaints.createdAt));

    return res.status(200).json({ success: true, allComplaints });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const viewHostelComplaints = async (req, res) => {
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
      return res.status(404).json({ success: false, message: "NO HOSTEL FOUND" });
    }

    const allComplaints = await db
      .select({
        complaintId: complaints.complaintId,
        title: complaints.title,
        description: complaints.description,
        status: complaints.status,
        createdAt: complaints.createdAt,
        hostelId: complaints.hostelId,
        hostelName: hostels.name,
        tenantName: users.name,
        tenantEmail: users.email,
        roomName: rooms.roomName,
      })
      .from(complaints)
      .innerJoin(hostels, eq(complaints.hostelId, hostels.hostelId))
      .innerJoin(users, eq(complaints.authorId, users.id))
      .leftJoin(rooms, eq(users.roomId, rooms.roomId))
      .where(eq(complaints.hostelId, hostelid))
      .orderBy(desc(complaints.createdAt));

    return res.status(200).json({ success: true, allComplaints });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteComplaints = async (req, res) => {
  try {
    const { complaintid } = req.params;
    const [existingComplaint] = await db
      .select()
      .from(complaints)
      .innerJoin(
        hostels,
        eq(complaints.hostelId, hostels.hostelId)
      )
      .where(
        and(
          eq(complaints.complaintId, complaintid),
          eq(hostels.ownerId, req.user.id)
        )
      );
    if (!existingComplaint) {
      return res.status(404).json({ success: false, message: "NO SUCH COMPLAINT EXISTS" });
    }

    await db.delete(complaints).where(eq(complaints.complaintId, complaintid));
    return res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintid } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!["pending", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: pending, resolved",
      });
    }

    // Check complaint belongs to hostel owned by current admin
    const [existingComplaint] = await db
      .select()
      .from(complaints)
      .innerJoin(
        hostels,
        eq(complaints.hostelId, hostels.hostelId)
      )
      .where(
        and(
          eq(complaints.complaintId, complaintid),
          eq(hostels.ownerId, req.user.id)
        )
      );

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found or unauthorized",
      });
    }

    await db
      .update(complaints)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(complaints.complaintId, complaintid));

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const viewMycomplaints = async(req,res)=>{
    try{
        const myComplaints = await db.select().from(complaints).where(
            eq(complaints.authorId,req.user.id)
        );
        return res.status(200).json({success:true,myComplaints});
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message});
    }
}

export const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const [tenant] = await db
      .select({
        roomId: users.roomId,
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!tenant?.roomId) {
      return res.status(400).json({
        success: false,
        message: "Tenant is not assigned to any room",
      });
    }

    const [room] = await db
      .select({
        hostelId: rooms.hostelId,
      })
      .from(rooms)
      .where(eq(rooms.roomId, tenant.roomId));

    const [newComplaint] = await db
      .insert(complaints)
      .values({
        authorId: req.user.id,
        hostelId: room.hostelId,
        title,
        description,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTenantComplaint = async (req, res) => {
  try {
    const { complaintid } = req.params;
    const [existingComplaint] = await db
      .select()
      .from(complaints)
      .where(
        and(
          eq(complaints.complaintId, complaintid),
          eq(complaints.authorId, req.user.id)
        )
      );

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await db.delete(complaints).where(eq(complaints.complaintId, complaintid));
    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};