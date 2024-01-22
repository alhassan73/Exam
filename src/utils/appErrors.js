class AppError extends Error {
  constructor(message, statucCode) {
    super(message);
    this.statusCode = statucCode;
  }
}

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};

export const globalErrorHandler = (err, req, res, next) => {
  if (process.env.MODE === "development") {
    developmentMode(err, req, res, next);
  } else {
    productionMode(err, req, res, next);
  }
};

const developmentMode = (err, req, res, next) => {
  let statucCode = err.statusCode || 500;
  return res.json({ status: statucCode, error: err.message, Stack: err.stack });
};

const productionMode = (err, req, res, next) => {
  let statucCode = err.statusCode || 500;
  return res.json({ status: statucCode, error: err.message });
};

export const routingError = (req, res, next) => {
  return next(new AppError(`Invalid Url ${req.originalUrl} `));
};

export default AppError;
