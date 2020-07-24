// const winstonFormat =
//   "[:date] :remote-addr - :remote-user :method :url HTTP/:http-version :status :response-time ms";

const winston = require("winston");
const path = require("path");
const root = require("./Util/path");

const getTime = () => {
  const date = new Date();
  const format = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
  ] = format.formatToParts(date);
  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

class LoggerService {
  constructor(route) {
    this.log_data = null;
    this.route = route;

    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf((info) => {
              let message = `[${getTime()}] - ${info.message}`;
              return message;
            })
          ),
        }),

        new winston.transports.File({
          level: "info",
          filename: path.join(root, "logfiles", "info.log"),
          format: winston.format.printf((info) => {
            let message = `[${getTime()}] - ${info.message}`;
            return message;
          }),
        }),
      ],
    });
    this.logger = logger;
  }

  setLogData(log_data) {
    this.log_data = log_data;
  }

  async info(message) {
    this.logger.log("info", message);
  }
}
module.exports= LoggerService;
