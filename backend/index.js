import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/authRoutes.js";
dotenv.config();

const PORT = 3000;
const app = express();
connectDB();
// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for enabling CORS
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);


// Route for testing
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
