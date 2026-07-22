import Admin from "../models/Admin.js";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  clearAuthCookie,
  createSessionToken,
  SESSION_DURATION_MS,
} from "../config/auth.js";


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

async function createAndStoreSession(user) {
  const { token, sessionId } = createSessionToken(user);

  user.sessionToken = sessionId;
  user.sessionExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  user.online = true;
  await user.save();

  return token;
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

  const token = await createAndStoreSession(admin);

  const authUser = {
    _id: admin._id,
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };

  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions()).status(200).json({
    success: true,
    message: "Admin login successful",
    user: authUser,
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

  const token = await createAndStoreSession(staff);
  const authUser = {
    _id: staff._id,
    id: staff._id,
    name: staff.name,
    employeeId: staff.employeeId,
    username: staff.username,
    role: staff.role,
    color: staff.color,
  };

  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions()).status(200).json({
    success: true,
    message: "Kitchen login successful",
    user: authUser,
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

  clearAuthCookie(res);
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const refreshSession = async (req, res) => {
  const token = await createAndStoreSession(req.user);

  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions()).json({
    success: true,
    user: toAuthUser(req.user),
  });
};
