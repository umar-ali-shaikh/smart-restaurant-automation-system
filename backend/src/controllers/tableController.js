import QRCode from "qrcode";
import Table from "../models/Table.js";
import { getIO } from "../sockets/orderSocket.js"; // Socket handler file ka path link import jodo

// 1. CREATE TABLE
export const createTable = async (req, res) => {
  try {
    // Body se dono keys ka backup nikal lo taaki frontend se kuch bhi aaye missing na ho
    const { tableNumber, tableNo, capacity, status } = req.body;

    // Jo bhi value available ho use parse karo
    const finalTableNumber = parseInt(tableNumber || tableNo, 10);

    if (!finalTableNumber) {
      return res.status(400).json({ success: false, message: "Table number is required" });
    }

    const existing = await Table.findOne({ tableNumber: finalTableNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: "Table already exists" });
    }

    const clientUrl = process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
    const qrCode = await QRCode.toDataURL(`${clientUrl}/?table=${finalTableNumber}`);

    const table = await Table.create({
      tableNumber: finalTableNumber, // Sahi dynamic field save ho rahi hai
      capacity: parseInt(capacity, 10) || 4,
      status: status || "Available",
      qrCode,
    });

    res.status(201).json({ success: true, message: "Table created", data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET ALL TABLES
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });

    res.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET SINGLE TABLE
export const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    res.json({
      success: true,
      data: table,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE TABLE
export const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    const { tableNumber, capacity, status } = req.body;

    // CRITICAL FIX: Agar tableNumber change ho raha hai, toh naya QR Code banao!
    if (tableNumber && tableNumber !== table.tableNumber) {
      // Check karo kahin naya number kisi aur table ka toh nahi hai
      const duplicateCheck = await Table.findOne({ tableNumber });
      if (duplicateCheck) {
        return res.status(400).json({ success: false, message: "Target table number already taken" });
      }

      table.tableNumber = tableNumber;
      const clientUrl = process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
      table.qrCode = await QRCode.toDataURL(`${clientUrl}/?table=${tableNumber}`);
    }

    if (capacity) table.capacity = capacity;
    if (status) table.status = status;

    const updated = await table.save();

    res.json({
      success: true,
      message: "Table updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DELETE TABLE
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    await table.deleteOne();

    res.json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. AUTOMATIC BOOK TABLE ON SCAN
export const bookTableOnScan = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const table = await Table.findOne({ tableNumber: parseInt(tableNumber, 10) });

    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    if (table.status === "Available") {
      table.status = "Occupied";
      table.occupiedAt = new Date();
      table.occupiedBy = req.customer?._id || null;
      await table.save();

      // 🔥 REAL-TIME EMIT BROADCAST VIA GLOBAL SOCKET INSTANCE
      try {
        const io = getIO();
        io.emit("tableUpdated", { tableNumber: table.tableNumber, status: "Occupied", data: table });
      } catch (socketErr) {
        console.log("Socket system not active or listening yet:", socketErr.message);
      }

      return res.json({ success: true, message: "Table booked automatically on scan", data: table });
    }

    res.json({ success: true, message: "Table is already occupied", data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7.  Leave Table
export const leaveTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const table = await Table.findOne({ tableNumber });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    table.status = "Available";
    table.currentOrder = null;
    table.currentSession = null;
    table.occupiedBy = null;
    table.occupiedAt = null;

    await table.save();

    try {
      const io = getIO();

      io.emit("tableUpdated", {
        tableNumber: table.tableNumber,
        status: "Available",
        data: table,
      });
    } catch { }

    res.json({
      success: true,
      message: "Table released successfully",
      data: table,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};