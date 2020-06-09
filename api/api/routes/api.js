const express = require("express");
const api = express.Router();

api.get("/", (req, res) => {
  res.status(200);
  res.json({ Response: "Hello from the API" });
});

//Requests that passed the routes above are not supported and therefore seen as errors.
api.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//handles all other errors
api.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = api;
