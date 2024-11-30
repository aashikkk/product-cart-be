import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        sku: {
            type: String,
            required: true,
        },
        image: [
            {
                type: String,
                required: true,
            },
        ],
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            defaultValue: 1,
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;