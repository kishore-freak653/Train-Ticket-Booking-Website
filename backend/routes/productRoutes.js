import express from "express";

import {protect,grantAccess} from "../middleware/auth";
import { CreateProduct, DeleteProduct, GetProduct, updateProduct } from "../controllers/ProductController";
import { assignVendorsToStaff } from "../controllers/AdminController";
const router = express.Router();


// Public routes
router.get('/', GetProduct);

// Protected routes
router.post('/', protect, grantAccess('admin', 'vendor'), CreateProduct);
router.get('/vendor/:vendorId', protect, grantAccess('admin', 'staff', 'vendor'), assignVendorsToStaff);
router.put('/:id', protect, grantAccess('admin', 'vendor'), updateProduct);
router.delete('/:id', protect, grantAccess('admin', 'vendor'), DeleteProduct);

export default router;