import multer from "multer";
import { nanoid } from "nanoid";
import AppError from "./appErrors.js";
import validExtensions from "./validExtention.js";

const multerCloudnairy = (customValidation) => {
  if (!customValidation) {
    customValidation = validExtensions.image;
  }

  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new AppError("Ivalid Type"), false);
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};

export default multerCloudnairy;
