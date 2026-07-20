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

const upload = multer({ storage });

export default upload;
