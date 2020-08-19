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
