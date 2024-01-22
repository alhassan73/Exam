import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose
      .connect(process.env.DB);
    console.log("Database connection established");
  } catch (err) {
    console.log("Error connecting to Database: " + err.message);
  }
};

export default dbConnection;
