import mongoose from "mongoose";

export const validateObjectId = (param = "id") => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${param}`,
    });
  }

  return next();
};
