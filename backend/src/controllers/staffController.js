import Admin from "../models/Admin.js";

const publicFields = "_id name employeeId username email role color online createdAt updatedAt";

function normalizeEmployeeId(employeeId = "") {
  return String(employeeId).trim().toUpperCase();
}

export const getStaff = async (req, res) => {
  try {
    const staff = await Admin.find().select(publicFields).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, employeeId, username, email = "", password, role = "kitchen", color } = req.body;
    const normalizedEmployeeId = normalizeEmployeeId(employeeId || username);

    if (!name || !normalizedEmployeeId || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Employee ID and password are required",
      });
    }

    const exists = await Admin.findOne({ employeeId: normalizedEmployeeId });
    if (exists) {
      return res.status(400).json({ success: false, message: "Staff account already exists" });
    }

    const staff = await Admin.create({
      name,
      employeeId: normalizedEmployeeId,
      username: username || normalizedEmployeeId,
      email: email || undefined,
      password,
      role,
      color,
    });

    const created = await Admin.findById(staff._id).select(publicFields);

    res.status(201).json({
      success: true,
      message: "Staff account created",
      data: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Admin.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff account not found" });
    }

    const { name, employeeId, username, email, password, role, color } = req.body;

    if (name !== undefined) staff.name = name;
    if (employeeId !== undefined || username !== undefined) {
      const normalizedEmployeeId = normalizeEmployeeId(employeeId || username);
      const exists = await Admin.findOne({
        employeeId: normalizedEmployeeId,
        _id: { $ne: staff._id },
      });

      if (exists) {
        return res.status(400).json({ success: false, message: "Employee ID already exists" });
      }

      staff.employeeId = normalizedEmployeeId;
      staff.username = username || normalizedEmployeeId;
    }
    if (username !== undefined) {
      staff.username = username || staff.employeeId;
    }
    if (email !== undefined) staff.email = email || undefined;
    if (password) staff.password = password;
    if (role) staff.role = role;
    if (color !== undefined) staff.color = color;

    await staff.save();

    const updated = await Admin.findById(staff._id).select(publicFields);

    res.json({
      success: true,
      message: "Staff account updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaffStatus = async (req, res) => {
  try {
    const staff = await Admin.findByIdAndUpdate(
      req.params.id,
      { online: Boolean(req.body.online) },
      { new: true },
    ).select(publicFields);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff account not found" });
    }

    res.json({
      success: true,
      message: "Staff status updated",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Admin.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff account not found" });
    }

    await staff.deleteOne();

    res.json({
      success: true,
      message: "Staff account deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
