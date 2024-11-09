const { Router } = require("express");
const { signUpUser, LoginUser, welcome, apiChange, GetapiChange } = require("../Controllers/UserController.js");
const userRouter = Router();
const welcomeRouter = Router();
const apiRouter = Router();
apiRouter.route("/api")
  .get(GetapiChange)
  .post(apiChange)
welcomeRouter.route("/")
  .get(welcome)
userRouter.route('/')
  .post(signUpUser);

userRouter.route('/login/')
  .post(LoginUser);


module.exports = { userRouter, welcomeRouter,apiRouter };

