import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); // allows us to accept JSON data in the req.body

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,DELETE,PUT",
        credentials: true,
    })
);

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});
