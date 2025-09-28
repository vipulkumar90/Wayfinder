import winston from "winston";
import config from "@/config/env.js";

const enumerateErrorFormat = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    if (
      info instanceof Error ||
      (info.message && info.message instanceof Error)
    ) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  }
);

const level = config.env === "development" ? "debug" : "info";

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  enumerateErrorFormat(),
  winston.format.splat(),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    const ts = String(info.timestamp ?? "");
    const lvl = String(info.level);
    const msg = String(info.message);
    return `[${ts}] ${lvl}: ${msg}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  enumerateErrorFormat(),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: level,
  format: config.env === "development" ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

if (config.env === "production") {
  // error.log records only error logs
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })
  );
  // Record all kind of logs
  logger.add(
    new winston.transports.File({
      filename: "logs/app.log",
    })
  );
}

export default logger;
