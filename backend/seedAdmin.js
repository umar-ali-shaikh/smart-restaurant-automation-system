import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./src/models/Admin.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const employeeId = process.env.SEED_ADMIN_EMPLOYEE_ID || "ADMIN001";
    const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
    const existing = await Admin.findOne({ employeeId });

    if (existing) {
      existing.name = process.env.SEED_ADMIN_NAME || existing.name || "System Admin";
      existing.username = employeeId;
      existing.email = process.env.SEED_ADMIN_EMAIL || existing.email || "admin@example.com";
      existing.password = password;
      existing.role = "admin";
      await existing.save();
    } else {
      await Admin.create({
        name: process.env.SEED_ADMIN_NAME || "System Admin",
        employeeId,
        username: employeeId,
        email: process.env.SEED_ADMIN_EMAIL || "admin@example.com",
        password,
        role: "admin",
      });
    }

    console.log(`Admin ready: ${employeeId} / ${password}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
