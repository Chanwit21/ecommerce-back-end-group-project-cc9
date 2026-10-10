const unavailable = () => {
  const error = new Error("Payments are not configured");
  error.statusCode = 503;
  throw error;
};
module.exports = process.env.OMISE_SECRET_KEY
  ? require("omise")({ secretKey: process.env.OMISE_SECRET_KEY })
  : {
      customers: new Proxy({}, { get: () => unavailable }),
      charges: new Proxy({}, { get: () => unavailable }),
    };
