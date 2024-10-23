// backend/src/server.js
const app = require('./app');
const http = require('http');
const sequelize = require('../config/database');
require('../src/models'); // Import models to register them with Sequelize

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    sequelize.sync({ alter: true }).then(() => {
      console.log('Database synced');
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
