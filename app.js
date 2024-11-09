const express = require("express");
const CustomErrorHandler = require("./Utils/CustomErrorHandler");
const ErrorHandling = require("./Controllers/ErrorHandling");
const { userRouter, welcomeRouter,apiRouter } = require('./Routes/UserRouter');
const app = express();
app.use(express.json());
app.use('/', welcomeRouter);
app.use('/',apiRouter)
app.use('/api/v1/user/', userRouter);
app.all("*", (req, res, next) => {
  let err = new CustomErrorHandler(`the given url ${req.originalUrl} is not present`, 400);
  next(err);
});
app.use(ErrorHandling);

module.exports = app;

