import { eq } from "drizzle-orm";
import { db } from "../db.js"
import { users } from "../schema/schema.js"
import bcrypt from "bcrypt";

export const createUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name|| !email||!password){
            return res.status(400).json({success:false,message:"Enter all fields"});
        }

        const [existingUser] = await db.select().from(users).where(eq(users.email,email));
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: "tenant"
        }).returning({id: users.id,name: users.name,email: users.email,role: users.role});
        return res.status(201).json({success:true, newUser})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message});
    }

}

export const deleteUser = async(req,res)=>{
    try{
        const {userid} = req.params;
        const [existingUser] = await db.select({name:users.name,email: users.email, role:users.role})
        .from(users).where(eq(users.id, userid));
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        await db.delete(users).where(eq(users.id,userid));
        return res.status(200).json({success:true, message:"User deleted successfully",deletedUser: existingUser});
    }
    catch(err){
        return res.status(500).json({success:false,message:err.message});
    }
}

export const editUser = async(req,res)=>{
    try{
        const {userid} = req.params;
        const [existingUser] = await db.select()
        .from(users).where(eq(users.id, userid));
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const [updatedUser] = await db.update(users).set(req.body).where(eq(users.id,userid)).returning({
            name:users.name,
            email:users.email,
            role:users.role
        })
        return res.status(200).json({success:true,message:"User Edited Successfully",updatedUser});

    }
    catch(err){
        return res.status(500).json({success:false,message:err.message});
    }
}   