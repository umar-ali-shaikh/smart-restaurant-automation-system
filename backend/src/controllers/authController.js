import crypto from "crypto";
import Admin from "../models/Admin.js";


const publicFields = "_id name employeeId username email role color online createdAt updatedAt";

function toAuthUser(user) {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    employeeId: user.employeeId,
    username: user.username,
    email: user.email,
    role: user.role,
    color: user.color,
    online: user.online,
  };
}

function createSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const admin = await Admin.findOne({
    email: email.toLowerCase(),
    role: "admin",
  }).select("+sessionToken +sessionExpiresAt");

  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = createSessionToken();

  admin.sessionToken = token;
  admin.sessionExpiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  );
  admin.online = true;


  console.log(token)
  await admin.save();

  const authUser = {
    _id: admin._id,
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    user: authUser,
    token,
  });
};


export const kitchenLogin = async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({
      success: false,
      message: "Employee ID and password are required",
    });
  }

  const staff = await Admin.findOne({
    employeeId: employeeId.toUpperCase(),
    role: "kitchen",
  }).select("+sessionToken +sessionExpiresAt");

  if (!staff || !(await staff.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid Employee ID or password",
    });
  }

  const token = createSessionToken();

  staff.sessionToken = token;
  staff.sessionExpiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  );
  staff.online = true;

  await staff.save();
  const check = await Admin.findById(staff._id);

  console.log(check.sessionToken);
  console.log(check.sessionExpiresAt);
  const authUser = {
    _id: staff._id,
    id: staff._id,
    name: staff.name,
    employeeId: staff.employeeId,
    username: staff.username,
    role: staff.role,
    color: staff.color,
  };

  res.status(200).json({
    success: true,
    message: "Kitchen login successful",
    user: authUser,
    token,
  });
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    data: toAuthUser(req.user),
    user: toAuthUser(req.user),
  });
};

export const logout = async (req, res) => {
  if (req.user?._id) {
    await Admin.findByIdAndUpdate(req.user._id, {
      sessionToken: "",
      sessionExpiresAt: null,
      online: false,
    });
  }

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
