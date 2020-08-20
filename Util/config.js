const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "5bits301@gmail.com",
    pass: "wugrex-Dysgu0-faxpeh",
  },
});

exports.secretKey = "5Bits2020";
exports.emailAddress = "5bits301@gmail.com";
exports.transporter = transporter;
exports.api_server_port = 8080;
exports.db_server_port = 3000;
