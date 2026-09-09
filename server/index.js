import express from "express";
import { pool } from "./db.js";
import authRouter from "./routes/authRoute.js";
import { protect } from "./middlewares/authMiddleware.js";
import { isAdmin } from "./middlewares/isAdmin.js";
import {isTenant} from "./middlewares/isTenant.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import hostelRouter from "./routes/hostel_RoomRoute.js";
import complaintAdminRouter from "./routes/complaintAdminRoute.js";
import complaintTenantRouter from "./routes/complaintTenantRoute.js";

try {
  const client = await pool.connect();
  console.log("Database connected");
  client.release();

  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());

  app.use("/api/auth",authRouter);
  app.use("/api/admin/users",protect,isAdmin,userRouter);
  app.use("/api/admin/hostel",protect,isAdmin,hostelRouter);
  app.use("/api/complaints/admin",protect,isAdmin,complaintAdminRouter);
  app.use("/api/complaints/tenant",protect,isTenant,complaintTenantRouter);

  app.listen(8080, () => {
    console.log("Server started");
  });
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}