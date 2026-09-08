import { complaints, hostels,users } from "../schema/schema.js";
import { db } from "../db.js";
import { and,eq } from "drizzle-orm";

export const viewHostelComplaints = async (req,res)=>{
    try{
         const {hostelid} = req.params;
         const [existingHostel] = await db.select().from(hostels).where(and(
            eq(hostels.hostelId,hostelid),
            eq(hostels.ownerId,req.user.id)));

         if(!existingHostel){
            return res.status(404).json({success:false, message:"NO HOSTEL FOUND"});
         }
         const allComplaints = await db
        .select({
            complaintId: complaints.complaintId,
            title: complaints.title,
            description: complaints.description,
            status: complaints.status,
            createdAt: complaints.createdAt,
            tenantName: users.name,
            tenantEmail: users.email,
        }).from(complaints)
        .innerJoin(
            users,
            eq(complaints.authorId, users.id)
        ).where(eq(complaints.hostelId, hostelid));

        return res.status(200).json({success:true, allComplaints});
    }
    catch(err){
        return res.status(500).json({success:false ,message:err.message});
    }
}

export const deleteComplaints = async (req,res)=>{
   try{
        const {complaintid} = req.params;
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
        if(!existingComplaint){
            return res.status(404).json({success:false,message:"NO SUCH COMPLAINT EXISTS"});
        }

        await db.delete(complaints).where(eq(complaints.complaintId,complaintid));
        return res.status(200).json({success:true,message:"Deleted Sucessfully"});
    }
    catch(err){
        return res.status(500).json({success:false,message:err.message});
    }
}


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
        return res.status(200).json({myComplaints});
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message});
    }
}

export const createComplaint = async (req,res)=>{
    
}