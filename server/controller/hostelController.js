import { and, eq } from "drizzle-orm";
import { db } from "../db.js"
import { hostels } from "../schema/schema.js"
import bcrypt from "bcrypt";

export const createHostel = async (req,res)=>{
    try{
        const {name,ownerId,description} = req.body;
        if(!name|| !ownerId||!description){
            return res.status(400).json({success:false,message:"Enter all fields"});
        }

        const [existingHostel] = await db.select().from(users).where(
            and(
            eq(hostels.name,name),
            eq(hostels.ownerId,ownerId)
            )
        );
        if (existingHostel) {
            return res.status(409).json({
                success: false,
                message: "You have another Hostel with same name"
            });
        }

        const [newHostel] = await db.insert(hostels).values({
            name,
            description,
            ownerId
        }).returning();
        return res.status(201).json({success:true, newHostel})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message});
    }

}

export const deleteHostel = async(req,res)=>{
    try{
        const {hostelid} = req.params;
        const [existingHostel] = await db.select()
        .from(hostels).where(eq(hostels.hostelId,hostelid));
        if (!existingHostel) {
            return res.status(404).json({
                success: false,
                message: "Hostel not found"
            });
        }
        await db.delete(hostels).where(eq(hostels.hostelId,hostelid));
        return res.status(200).json({success:true, message:"hostel deleted successfully",deletedHostel: existingHostel});
    }
    catch(err){
        return res.status(500).json({success:false,message:err.message});
    }
}

export const editHostel = async(req,res)=>{
    try{
        const {hostelid} = req.params;
        const [existingHostel] = await db.select()
        .from(hostels).where(eq(hostels.hostelId, hostelid));
        if (!existingHostel) {
            return res.status(404).json({
                success: false,
                message: "Hostel not found"
            });
        }

        const [updatedHostel] = await db.update(hostels).set(req.body).where(eq(hostels.hostelId,hostelid)).returning();
        return res.status(200).json({success:true,message:"Hostel Edited Successfully",updatedHostel});

    }
    catch(err){
        return res.status(500).json({success:false,message:err.message});
    }
}   