import bcrypt from "bcrypt";
import {db} from "../db.js"
import {users, rooms, hostels} from "../schema/schema.js"
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const signUp = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please provide name, email, and password.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail));
        if(existingUser.length > 0){
            return res.status(400).json({
                success: false,
                msg: "User already exists with this email.",
            });
        }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [newUser] = await db.insert(users).values({name, email: normalizedEmail, password: hashedPassword})
    .returning(
        { id: users.id, name: users.name, email: users.email, role: users.role });
    return res.status(201).json({
      success: true,
      msg: "Account created successfully! Please log in.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }});

    
    }
    catch (error) {
   
        return res.status(500).json({
        success: false,
        msg: error.message,
        });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide email and password.",
      });
    }

    // 1. Find user in database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password.",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password.",
      });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_jwt_secret_key",
      { expiresIn: "1d" }
    );

    // 4. Set cookie 
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        success: true,
        msg: "Logged in successfully!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  return res.status(200).json({
    success: true,
    msg: "Logged out successfully.",
  });
};

export const getMe = async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        roomId: users.roomId,
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let tenantRoom = null;
    if (user.role === "tenant" && user.roomId) {
      const [roomData] = await db
        .select({
          roomId: rooms.roomId,
          roomName: rooms.roomName,
          capacity: rooms.capacity,
          rent: rooms.rent,
          hostelId: rooms.hostelId,
          hostelName: hostels.name,
        })
        .from(rooms)
        .innerJoin(hostels, eq(rooms.hostelId, hostels.hostelId))
        .where(eq(rooms.roomId, user.roomId));

      tenantRoom = roomData || null;
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        room: tenantRoom,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};