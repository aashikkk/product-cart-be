import express from "express";
import mongoose from "mongoose";
import upload from "../config/multerConfig.js";

import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from "../controller/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 3), createProduct);
router.put("/:id", upload.array("images", 2), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
