export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
export const globalErrorHandling = (err, req, res, next) => {
  const status = err.statusCode || 500;
  return res.status(status).json({
    error: err.message,
    status,
    ...(process.env.MODE === "dev" ? { stack: err.stack } : {}),
  });
};
