import express from "express";
import { getMe, LoginUser, RegisterUser } from "../controllers/AuthController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.post('/register',RegisterUser);
router.post('/login',LoginUser);
router.get('/me',protect,getMe);

export default router;