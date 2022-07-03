import { createLogger, format, transports } from "winston";

const { combine, printf, timestamp } = format;
const { Console, File } = transports;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    new Console({
      level: "http",
    }),
    new File({
      filename: "combined.log",
      level: "http",
    }),
    new File({
      filename: "errors.log",
      level: "error",
    }),
  ],
});

export default logger;
