import { format, transports } from 'winston';

const { timestamp, combine, errors, printf, json } = format;

const logFormat = printf(
  ({ level, message, timestamp, stack }) =>
    `${timestamp} ${level}: ${message}: ${stack}`,
);

export const DEV_LOGGER_CFG = {
  format: combine(
    format.colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [new transports.Console()],
};

export const PROD_LOGGER_CFG = {
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [new transports.Console()],
};
