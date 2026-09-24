import { DefaultLogger } from "drizzle-orm";
import Router from "express";

const router = Router();

router.get("/",(req,res)=>{
    res.send(200).json({success: true, status:"healthy"});
})

export default router;