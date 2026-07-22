import QRCode from "qrcode";
import Table from "../models/Table.js";
import TableSession from "../models/TableSession.js";
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
    const tables = await Table.find()
      .populate({ path: "currentSession", populate: { path: "customer", select: "name email" } })
      .sort({ tableNumber: 1 })
      .lean();

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

    if (table.status === "Occupied") {
      if (table.occupiedBy?.toString() !== req.guest._id.toString()) {
        return res.status(409).json({ success: false, message: "This table is currently occupied." });
      }

      const session = table.currentSession
        ? await TableSession.findByIdAndUpdate(table.currentSession, { lastSeen: new Date(), lastActivityAt: new Date() }, { new: true })
        : null;
      return res.json({ success: true, message: "Existing table session restored", data: { ...table.toObject(), currentSession: session } });
    }

    if (table.status === "Available") {
      const session = await TableSession.create({ table: table._id, customer: req.guest._id });
      table.status = "Occupied";
      table.occupiedAt = new Date();
      table.occupiedBy = req.guest._id;
      table.currentSession = session._id;
      await table.save();

      // 🔥 REAL-TIME EMIT BROADCAST VIA GLOBAL SOCKET INSTANCE
      try {
        const io = getIO();
        io.to("adminRoom").emit("tableUpdated", { tableNumber: table.tableNumber, status: "Occupied", data: table });
      } catch (socketErr) {
        console.log("Socket system not active or listening yet:", socketErr.message);
      }

      return res.json({ success: true, message: "Table booked automatically on scan", data: table });
    }

    res.status(409).json({ success: false, message: "This table is currently unavailable." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7.  Leave Table
export const leaveTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const table = await Table.findOne({ tableNumber: parseInt(tableNumber, 10) });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    if (table.occupiedBy && table.occupiedBy.toString() !== req.guest._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot release another guest's table" });
    }

    const sessionId = table.currentSession;
    table.status = "Available";
    table.currentOrder = null;
    table.currentSession = null;
    table.occupiedBy = null;
    table.occupiedAt = null;

    await table.save();

    if (sessionId) {
      await TableSession.findByIdAndUpdate(sessionId, {
        isActive: false,
        endedAt: new Date(),
        lastSeen: new Date(),
        lastActivityAt: new Date(),
      });
    }

    try {
      const io = getIO();

      io.to("adminRoom").emit("tableUpdated", {
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

export const adminReleaseTable = async (req, res) => {
  const table = await Table.findOne({ tableNumber: Number(req.params.tableNumber) });
  if (!table) return res.status(404).json({ success: false, message: "Table not found" });
  if (table.currentSession) {
    await TableSession.findByIdAndUpdate(table.currentSession, { isActive: false, endedAt: new Date(), lastSeen: new Date(), lastActivityAt: new Date() });
  }
  table.status = "Available";
  table.currentOrder = null;
  table.currentSession = null;
  table.occupiedBy = null;
  table.occupiedAt = null;
  await table.save();
  try { getIO().to("adminRoom").emit("tableUpdated", { tableNumber: table.tableNumber, status: "Available", data: table }); } catch { /* socket is optional during startup */ }
  return res.json({ success: true, message: "Table released successfully", data: table });
};

export const getTableSessionHistory = async (req, res) => {
  const table = await Table.findOne({ tableNumber: Number(req.params.tableNumber) }).select("_id");
  if (!table) return res.status(404).json({ success: false, message: "Table not found" });
  const sessions = await TableSession.find({ table: table._id })
    .populate("customer", "name email")
    .sort({ startedAt: -1 })
    .limit(100)
    .lean();
  return res.json({ success: true, data: sessions });
};
