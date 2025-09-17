import mongoose from "mongoose";
import { ENV } from "../config/env";
import { seedScript } from "./seed/seed-script";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(
      `MongoDB Connected: ${conn.connection.host.yellow} - Database Name: ${conn.connection.name.green}`
    );
    seedScript();
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
