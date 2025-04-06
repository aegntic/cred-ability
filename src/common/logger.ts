import winston from 'winston';
import { hostname } from 'os';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  trace: 5,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Define custom formats
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transport options
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
      )
    ),
  }),
  // File transport - all logs
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: winston.format.json(),
  }),
  // File transport - error logs
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.json(),
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  defaultMeta: {
    service: 'cred-ability',
    hostname: hostname(),
    environment: process.env.NODE_ENV || 'development',
  },
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Helper function to mask sensitive data in logs
export function maskCredential(credential: string): string {
  if (!credential || credential.length < 8) {
    return '***';
  }
  
  // Keep first and last 3 characters, mask the rest
  const firstThree = credential.substring(0, 3);
  const lastThree = credential.substring(credential.length - 3);
  const masked = '*'.repeat(Math.min(10, credential.length - 6));
  
  return `${firstThree}${masked}${lastThree}`;
}

// Helper function to zero out sensitive data from memory
export function zeroize(value: string): void {
  if (typeof value === 'string' && value.length > 0) {
    // This is a best-effort attempt to clear the string from memory
    // Note: JavaScript strings are immutable, so this doesn't fully clear the original
    // string from memory, but helps reduce the window of exposure
    for (let i = 0; i < value.length; i++) {
      value = value.substring(0, i) + '\0' + value.substring(i + 1);
    }
  }
}
