import Product from "../models/productModel.js";
import mongoose from "mongoose";

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
            .json({ success: false, message: "Invalid Product ID get" });
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

export const createProduct = async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { sku, name, quantity, description, price, mainImage } = req.body;

    // Validate required fields
    if (!sku || !name || !quantity || !description || !price) {
        return res
            .status(400)
            .json({ message: "Please provide all fields -be" });
    }

    // Handle Image Upload
    let images = [];
    if (req.files) {
        // Save as fileName
        images = req.files.map((file) => file.filename);
    } else {
        return res.status(400).json({ message: "No images uploaded" });
    }

    // set mainImage to the first image if not provided
    const mainImageToUse = mainImage || images[0];

    const newProduct = new Product({
        sku,
        images,
        mainImage: mainImageToUse,
        name,
        quantity,
        description,
        price,
    });

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error(`Error in Create product: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    const { sku, name, quantity, description, price, mainImage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Product ID upd" });
    }

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Handle Image Upload
        let images = existingProduct.images;
        if (req.files) {
            const newImages = req.files.map((file) => file.filename);
            images = [...images, ...newImages];
        }

        // Set mainImage to the first image if not provided
        const mainImageToUse = mainImage || images[0];

        const updatedProductData = {
            sku,
            images,
            mainImage: mainImageToUse,
            name,
            quantity,
            description,
            price,
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updatedProductData,
            {
                new: true,
            }
        );
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.log("Error in Update product: ${error.message}");
        res.status(500).json({ success: false, message: "Server Error" });
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

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid Product ID del" });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error(`Error in Delete product: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const searchProducts = async (req, res) => {
    const { query } = req.query;
    // console.log(`Searching ${query}`);

    if (!query) {
        return res
            .status(400)
            .json({ success: false, message: "Query is required" });
    }

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        }).limit(10); // Limit the number of suggestions

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error in searching products: " + error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
