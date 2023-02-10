import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("backend connected...");
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  connect();
  console.log("Server running....");
});
