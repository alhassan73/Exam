import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("config/.env") });
import dbConnection from "../db/dbConnection.js";
import userRouter from "./module/user/user.routes.js";
import companyRouter from "./module/company/company.routes.js";
import jobsRouter from "./module/jobs/jobs.routes.js";
import AppError, { globalErrorHandling } from "./utils/appErrors.js";
const port = process.env.PORT || 5000;
const initApp = (app, express) => {
  app.use(express.json());

  dbConnection();
  app.use("/users", userRouter);
  app.use("/companies", companyRouter);
  app.use("/jobs", jobsRouter);
  // app.use("/uploads", express.static("uploads"));
  app.all("*", (req, res, next) => {
    const error = new AppError(
      `invalid request on url ${req.originalUrl}`,
      400
    );
    next(error);
  });
  app.use(globalErrorHandling);
  app.listen(port, () => {
    console.log("Server listening on port " + port);
  });
};

export default initApp;
