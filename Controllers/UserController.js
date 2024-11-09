const { User, Api } = require('../Models/UserModel.js'); // Import User model
const CustomErrorHandler = require("../Utils/CustomErrorHandler.js"); // Custom error handler utility
const asyncFunHandler = require("../Utils/asyncFunHandler.js"); // Async function handler to catch errors

// change api 
const apiChange = asyncFunHandler(async (req, res, next) => {
  let api = await Api.create(req.body);
  return res.status(201).json({
    success: true,
    message: "api is created successfully", // Success message
    data: api,
  });
});
const GetapiChange = asyncFunHandler(async (req, res, next) => {
  const api = await Api.findOne();
  return res.status(201).json({
    success: true,
    message: "api is get successfully", // Success message
    data: api,
  });
});
// welcome messge
const welcome = asyncFunHandler(async (req, res, next) => {
  // Create a new user in the database from the request body
  return res.status(200).json({
    success: true,
    message: "welcome to video call app",
  });
});
// Sign-up User Controller
const signUpUser = asyncFunHandler(async (req, res, next) => {
  // Create a new user in the database from the request body
  let user = await User.create(req.body);
  return res.status(201).json({
    success: true,
    message: "User is created successfully", // Success message
    data: user,
  });
});

// Login User Controller
const LoginUser = asyncFunHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let err = new CustomErrorHandler("Email or password is not provided", 400);
    return next(err);
  }
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    let err = new CustomErrorHandler("email or password is not correct", 400)
    return next(err);
  }
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: user,
  });
});

module.exports = {
  signUpUser,
  LoginUser,
  welcome,
  apiChange,
  GetapiChange
};