import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import AppError from "./appErrors.js";
import fs from "fs";
import validExtensions from "./validExtention.js";

const multerLocal = (customValidation, customPatch) => {
  if (!customPatch) {
    customPatch = "General";
  }
  const destPath = path.resolve(`uploads/${customPatch}`);

  if (!customValidation) {
    customValidation = validExtensions.image;
  }
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destPath);
    },

    filename: function (req, file, cb) {
      const uniqueName = nanoid() + file.originalname;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new AppError("Ivalid Type"), false);
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};

export default multerLocal;
