import bcrypt from "bcrypt";
import {db} from "../db.js"
import {users} from "../schema/schema.js"
import { eq } from "drizzle-orm";

export const signUp = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please provide name, email, and password.",
            });
        }

        const existingUser = await db.select().from(users).where(eq(users.email,email));
        if(existingUser.length > 0){
            return res.status(400).json({
        success: false,
        msg: "User already exists with this email.",
      });
        }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await db.insert(users).values({name,email,password:hashedPassword})
    .returning(
        { id: users.id, name: users.name, email: users.email });
    return res.status(201).json({
      success: true,
      msg: "Account created successfully! Please log in.",
      user: {
        name: newUser.name,
        email: newUser.email,
      }});

    
    }
    catch (error) {
   
        return res.status(500).json({
        success: false,
        msg: error.message,
        });
  }
}