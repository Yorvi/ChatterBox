// backend/src/utils/logger.js
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// winston's File transport does not create its directory for you
const logDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: path.join(logDir, 'app.log') }),
    new transports.Console(),
  ],
});

module.exports = logger;
