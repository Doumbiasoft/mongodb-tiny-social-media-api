import dotenv from "dotenv";
dotenv.config();

interface Env {
  NODE_ENV: string;
  PORT: number;
  API_BASE_URL: string;
  MONGO_URI: string;
}

export const ENV: Env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost",
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
};
