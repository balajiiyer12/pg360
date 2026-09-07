import express from "express";
import { pool } from "./db.js";
import authRouter from "./routes/authRoute.js";
import { protect } from "./middlewares/authMiddleware.js";
import { isAdmin } from "./middlewares/isAdmin.js";
import cookieParser from "cookie-parser";
import {userRouter} from "./routes/userRoute.js"

try {
  const client = await pool.connect();
  console.log("Database connected");
  client.release();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.use("/api/auth",authRouter);
  app.use("/api/admin/users",isAdmin,userRouter);
  app.get('/',protect,(req,res)=>{res.json({msg:"hello"})});

  app.listen(3000, () => {
    console.log("Server started");
  });
} catch (error) {
  console.error("Failed to connect to database:", error.message);
  process.exit(1);
}