import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/live", (req, res) => {
  res.status(200).json({ status: "ok", service: "restaurant-api" });
});

router.get("/ready", (req, res) => {
  const ready = mongoose.connection.readyState === 1;

  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not-ready",
    database: ready ? "connected" : "disconnected",
  });
});

export default router;
