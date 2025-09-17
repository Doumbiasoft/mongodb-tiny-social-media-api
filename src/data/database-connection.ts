import mongoose from "mongoose";
import { ENV } from "../config/env";
import UserModel from "../models/User";
import usersData from "./seed/user.json";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(
      `MongoDB Connected: ${conn.connection.host.yellow} - Database Name: ${conn.connection.name.green}`
    );
    const existingUserCount = await UserModel.countDocuments();
    if (existingUserCount === 0) {
      console.log("Seeding database...");
      await UserModel.insertMany(usersData);
      console.log("Database seeded successfully.");
    } else {
      console.log("Database already seeded.");
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
