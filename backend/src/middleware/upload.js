import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder:
        req.baseUrl.includes("categories")
          ? "restaurant-category"
          : req.baseUrl.includes("reviews")
          ? "restaurant-reviews"
          : "restaurant-menu",

      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, and WebP images are supported.");
      error.statusCode = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

export default upload;
