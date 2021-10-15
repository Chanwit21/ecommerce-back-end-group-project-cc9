exports.errorMiddleWare = (err, req, res, next) => {
  let code;
  let message;
  res.status(code || 500).json({ message: message || err.message });
};
