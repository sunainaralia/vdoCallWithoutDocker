function asyncFunHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => {
      next(err);
    });
  };
}

module.exports = asyncFunHandler; // Export the function
