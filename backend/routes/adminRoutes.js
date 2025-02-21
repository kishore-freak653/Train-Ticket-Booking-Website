import express from "express";
import { grantAccess, protect } from "../middleware/auth";
import { assignVendorsToStaff, createStaff, getUser } from "../controllers/AdminController";

const router = express.Router();


router.use(protect);
router.use(grantAccess('admin','super-admin'));


router.get("/users",getUser);
router.post("/users/staff", createStaff);
router.put("/staff/:staffId/assign", assignVendorsToStaff);

export default router;
