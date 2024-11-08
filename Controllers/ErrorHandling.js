const developmentError = (error, res) => {
  return res.status(error.errorStatus).json({
    status: error.errorStatus,
    message: error.message,
    stackTrace: error.stack,
    error: error
  });
};

const productionError = (error, res) => {
  if (error.isOprationalError) {
    return res.status(error.errorStatus).json({
      status: error.errorStatus,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const castError = (error, res) => {
  const err = `Your ID ${error.value} is not correct for ${error.path} field`;
  return res.status(error.errorStatus).json({
    status: 400,
    message: err,
  });
};

const duplicateError = (error, res) => {
  let msg = `${error.keyValue.name} is used previously, ${Object.keys(error.keyValue)[0]} is unique`;
  return res.status(400).json({
    status: 400,
    message: msg,
  });
};

const validationError = (error, res) => {
  let msg = Object.values(error.errors);
  let err = msg.map(err => err.message);
  return res.status(400).json({
    status: 400,
    message: `Validation Error: ${err.join(". ")}`,
  });
};

const invalidTokenError = (error, res) => {
  return res.status(401).json({
    status: 401,
    message: `Token is not valid, please provide a valid token`,
  });
};

const TokenExpiredError = (error, res) => {
  return res.status(401).json({
    status: 401,
    message: "Token has expired",
  });
};

const ErrorHandling = (error, req, res, next) => {
  error.errorStatus = error.errorStatus || 500;
  error.status = error.status || 'error';

  if (res.headersSent) {
    return next(error); // If headers are already sent, pass to the default error handler
  }

  if (process.env.NODE_ENV === "development") {
    return developmentError(error, res);
  } else {
    if (error.name === "CastError") {
      return castError(error, res); // Return immediately after sending the response
    } else if (error.code === 11000) {
      return duplicateError(error, res);
    } else if (error.name === "ValidationError") {
      return validationError(error, res);
    } else if (error.name === "JsonWebTokenError") {
      return invalidTokenError(error, res);
    } else if (error.name === "TokenExpiredError") {
      return TokenExpiredError(error, res);
    }
    // Only reaches here if no other specific error handler has been triggered
    return productionError(error, res);
  }
};
module.exports = ErrorHandling;