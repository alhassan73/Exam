import dotenv from "dotenv";
import path from "path";
import dbConnection from "../db/dbConnection.js";
import userRouter from "./module/user/user.routes.js";
import { globalErrorHandler, routingError } from "./utils/appErrors.js";
dotenv.config({ path: path.resolve("config/.env") });
const port = process.env.PORT || 3006;
const iniApp = (app, express) => {
  app.use(express.json());

  dbConnection();
  app.use("/user", userRouter);
  app.use("/uploads", express.static("uploads"));
  app.all("*", routingError);
  app.use(globalErrorHandler);
  app.listen(port, () => {
    console.log("Server listening on port " + port);
  });
};

export default iniApp;
