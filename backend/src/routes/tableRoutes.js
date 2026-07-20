import express from "express";
import {
  createTable,
  getTables,
  getTable,
  updateTable,
  deleteTable,
  bookTableOnScan, leaveTable
} from "../controllers/tableController.js";

import Table from "../models/Table.js";

import {
  protect,
  adminOnly,
  optionalProtect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================
   PUBLIC / CUSTOMER ROUTES
====================================== */

// Scan QR & Book Table
router.put("/scan-book/:tableNumber", bookTableOnScan);

// Get table by table number
router.get("/number/:tableNumber", optionalProtect, async (req, res) => {
  try {
    const table = await Table.findOne({
      tableNumber: parseInt(req.params.tableNumber, 10),
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.json({
      success: true,
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all tables (Customer + Admin)
router.get("/", optionalProtect, getTables);

// Get table by MongoDB ID
router.get("/:id", optionalProtect, getTable);


router.put("/leave/:tableNumber", optionalProtect, leaveTable);

/* ======================================
   ADMIN ONLY
====================================== */

router.post("/", protect, adminOnly, createTable);

router.put("/:id", protect, adminOnly, updateTable);

router.delete("/:id", protect, adminOnly, deleteTable);



export default router;