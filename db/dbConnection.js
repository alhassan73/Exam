import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("config/.env") });

const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log(`Database connection established`);
    })
    .catch((err) => {
      console.log(`error in connecting db ${err}`);
    });
};

export default dbConnection;
