const { Router } = require("express");
const { signUpUser, LoginUser, welcome } = require("../Controllers/UserController.js");
const userRouter = Router();
const welcomeRouter = Router();
welcomeRouter.route("/")
  .get(welcome)
userRouter.route('/')
  .post(signUpUser);

userRouter.route('/login/')
  .post(LoginUser);


module.exports = { userRouter,welcomeRouter };

