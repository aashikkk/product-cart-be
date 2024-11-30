import Product from "../models/productModel.js";
import mongoose from "mongoose";
import upload from "../config/multerConfig.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ data: products, success: true });
    } catch (error) {
        console.error("error in fetching products: " + error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const product = await Product.findById(id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error in getting Product" + error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// export const createProduct = async (req, res) => {
//     const product = req.body; // user will send this data

//     if (
//         !product.sku ||
//         !product.name ||
//         !product.image ||
//         !product.quantity ||
//         !product.description ||
//         !product.price
//     ) {
//         return res.status(400).json({ message: "Please provide all fields" });
//     }

//     const newProduct = new Product(product);

//     try {
//         await newProduct.save();
//         res.status(201).json({ success: true, data: newProduct });
//     } catch (error) {
//         console.error(`Error in Create product: ${error.message}`);
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// };

export const createProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error(`Multer Error: ${err.message}`);
            return res
                .status(400)
                .json({ success: false, message: err.message });
        }

        const { sku, name, quantity, description, price } = req.body;

        // Validate required fields
        if (!sku || !name || !quantity || !description || !price) {
            return res
                .status(400)
                .json({ message: "Please provide all fields" });
        }

        // Handle uploaded images
        const imagePaths = req.files.map((file) => file.path); // Get file paths

        try {
            // Create a new product
            const newProduct = new Product({
                sku,
                name,
                quantity,
                description,
                price,
                image: imagePaths, // Add image paths to the product
            });

            await newProduct.save();
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            console.error(`Error in Create product: ${error.message}`);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    });
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {
            new: true,
        });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.log("Error in Update product: ${error.message}");
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Product ID" });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error(`Error in Delete product: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
