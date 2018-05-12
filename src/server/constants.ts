/**
 * Server constants for connecting to external services and configuration
 * @typedef {Object} Constants
 * @property {string} DBConnection - The connection string to the Mongo database
 * @property {string} DBVersion - The version of the Mongo database
 */
export const Constants = {
  DBConnection: 'mongodb://localhost:27017/odyssey',
  DBVersion: '3.4.3',
  Environment: process.env.NODE_ENV,
  JWTSecret: 'a-very-secret-value',
  AdminExpiresIn: 60 * 60,
  StudentExpiresIn: 60 * 60,
  BlockTimeFormat: 'hh:mm a'
};

/**
 * Provider tokens for use with imports in NestJS modules
 * @typedef {Object} ProviderTokens
 */
export const ProviderTokens = {
  Database: 'DbToken',
  Student: 'Student',
  Block: 'Block',
  Reservation: 'Reservation',
};

export const ErrorMsg = {
  MissingToken: 'No user token present!',
  MissingBlock: 'Missing block!',
  MissingDate: 'Missing date!'
};
