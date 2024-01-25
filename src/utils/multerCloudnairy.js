import multer from "multer";
import validExtensions from "./validExtention.js";
import AppError from "./appErrors.js";

const multerCloudinary = (fileTypes) => {
  if (!fileTypes) {
    fileTypes = validExtensions.pdf;
  }
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (fileTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new AppError("invalid file Type"), false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};

export default multerCloudinary;
