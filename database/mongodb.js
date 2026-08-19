import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from "../config/env.js";

if (!DB_URI) {
    throw new Error(
        "DB_URI is not defined in environment variables .env.<development/production>.local"
    );
}

const connectToDatabase = async () => {
    console.log("Trying to connect to MongoDB...");

    try {
        await mongoose.connect(DB_URI);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectToDatabase;